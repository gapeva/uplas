import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Menu, X, CheckCircle, Lock, Play, MessageSquare, 
    Volume2, Video, Bookmark, Send, Settings, BookOpen, Pause 
} from 'lucide-react';
import api from '../lib/api'; // Your Axios instance

export default function LessonPage() {
    const { courseSlug, topicId } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [aiTutorOpen, setAiTutorOpen] = useState(false);
    
    // Data State (Real Data now)
    const [courseNav, setCourseNav] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(null);

    // Interactive State
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // TTS/Media State
    const [selectedVoice, setSelectedVoice] = useState('alloy');
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const audioRef = useRef(null);

    // AI Tutor State
    const [tutorQuery, setTutorQuery] = useState('');
    const [tutorMessages, setTutorMessages] = useState([]);

    // 1. Initial Load & Topic Change
    useEffect(() => {
        const loadLessonData = async () => {
            setLoading(true);
            try {
                // Fetch Navigation & Progress in parallel
                const [navRes, progressRes] = await Promise.all([
                    api.get(`/courses/courses/${courseSlug}/navigation/`),
                    api.get(`/courses/courses/${courseSlug}/progress/`)
                ]);
                setCourseNav(navRes.data); // Expects { modules: [...] }
                setProgress(progressRes.data);

                // Determine effective topic ID (default to first available if not in URL)
                let effectiveTopicId = topicId;
                if (!effectiveTopicId && navRes.data.modules.length > 0) {
                     effectiveTopicId = navRes.data.modules[0].topics[0].id;
                }

                // Load Topic Content
                if (effectiveTopicId) {
                    await loadTopicContent(courseSlug, effectiveTopicId);
                }

            } catch (err) {
                console.error("Failed to load lesson data", err);
            } finally {
                setLoading(false);
            }
        };
        loadLessonData();
    }, [courseSlug, topicId]);

    // 2. Load Topic Detail
    const loadTopicContent = async (cSlug, tId) => {
        try {
            const res = await api.get(`/courses/courses/${cSlug}/topics/${tId}/`);
            setCurrentTopic(res.data);
            
            // Reset state for new topic
            setMessages([]);
            setFeedback(null);
            setUserAnswer('');
            setAudioUrl(null);
            
            // Initialize Q&A Chat with AI Question
            if (res.data.questions && res.data.questions.length > 0) {
                setMessages([{ role: 'assistant', text: res.data.questions[0].text }]);
            } else if (res.data.initial_message) {
                setMessages([{ role: 'assistant', text: res.data.initial_message }]);
            }

        } catch (err) {
            console.error("Error loading topic", err);
        }
    };

    // 3. Handle Real Answer Submission (Parity with mcourse.js)
    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if(!userAnswer.trim()) return;

        const currentQ = currentTopic?.questions?.[0]; // Assuming simplified single-Q flow for now
        if (!currentQ) return;

        // Optimistic UI update
        const newHistory = [...messages, { role: 'user', text: userAnswer }];
        setMessages(newHistory);
        setIsSubmitting(true);
        const pendingAnswer = userAnswer;
        setUserAnswer('');

        try {
            const res = await api.post(
                `/courses/courses/${courseSlug}/topics/${currentTopic.id}/questions/${currentQ.id}/submit_answer/`,
                { answer: pendingAnswer }
            );

            const { feedback, is_correct } = res.data;
            
            setMessages(prev => [...prev, { role: 'assistant', text: feedback }]);
            setFeedback({ 
                type: is_correct ? 'success' : 'error', 
                text: is_correct ? 'Correct! Well done.' : 'Incorrect, try again.' 
            });

            if (is_correct) {
                // Refresh progress
                const pRes = await api.get(`/courses/courses/${courseSlug}/progress/`);
                setProgress(pRes.data);
                // Mark complete logic could happen here or backend side
            } else {
                setUserAnswer(pendingAnswer); // Let them edit
            }

        } catch (err) {
            setFeedback({ type: 'error', text: 'Failed to submit answer. Try again.' });
            setUserAnswer(pendingAnswer);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Real TTS Integration (Parity with mcourse.js)
    const handleTTS = async () => {
        if (isPlayingAudio) {
            audioRef.current?.pause();
            setIsPlayingAudio(false);
            return;
        }

        if (audioUrl) {
            audioRef.current?.play();
            setIsPlayingAudio(true);
            return;
        }

        // Generate Audio
        const textToRead = messages.length > 0 ? messages[messages.length - 1].text : currentTopic?.content;
        
        try {
            const res = await api.post('/ai_agents/tts/', {
                text: textToRead,
                voice: selectedVoice
            });
            
            const newAudioUrl = res.data.audio_url;
            setAudioUrl(newAudioUrl);
            
            // Create audio object
            if (audioRef.current) audioRef.current.pause();
            audioRef.current = new Audio(newAudioUrl);
            audioRef.current.onended = () => setIsPlayingAudio(false);
            
            await audioRef.current.play();
            setIsPlayingAudio(true);

        } catch (err) {
            alert("Failed to generate audio.");
            console.error(err);
        }
    };

    // 5. Real AI Tutor Integration
    const handleTutorAsk = async (e) => {
        e.preventDefault();
        if (!tutorQuery.trim()) return;

        const q = tutorQuery;
        setTutorMessages(prev => [...prev, { role: 'user', text: q }]);
        setTutorQuery('');

        try {
            const res = await api.post('/ai_agents/tutor/ask/', {
                query: q,
                course_id: courseSlug,
                topic_id: currentTopic?.id
            });
            setTutorMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
        } catch (err) {
            setTutorMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now." }]);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading classroom...</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
            {/* Sidebar Mapping (Same as before but using real courseNav) */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">Course Navigation</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {courseNav?.modules?.map((module, i) => (
                        <div key={module.id}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {module.title}
                            </h3>
                            <ul className="space-y-1">
                                {module.topics?.map(topic => (
                                    <li key={topic.id}>
                                        <Link 
                                            to={`/courses/${courseSlug}/learn/${topic.id}`}
                                            className={`flex items-center justify-between p-2 rounded text-sm transition ${
                                                currentTopic?.id === topic.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                            } ${topic.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="truncate">{topic.title}</span>
                                            {topic.is_completed && <CheckCircle size={14} className="text-green-500"/>}
                                            {topic.locked && <Lock size={14} className="text-gray-400"/>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {/* Progress Footer */}
                <div className="p-5 border-t bg-gray-50">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span className="font-bold">{progress?.percentage_completed || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress?.percentage_completed || 0}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>XP: <strong>{progress?.xp_points || 0}</strong></span>
                        <span>Badges: <strong>{progress?.badges_count || 0}</strong></span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600"><Menu/></button>
                        <h1 className="text-lg font-bold text-gray-800 truncate">{currentTopic?.title}</h1>
                    </div>
                    {/* ... Header actions ... */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Chat History */}
                        <div className="space-y-4 mb-8">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed ${
                                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'
                                    }`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <select 
                                    className="bg-gray-100 border-none rounded-lg text-sm px-3 py-2"
                                    value={selectedVoice}
                                    onChange={(e) => setSelectedVoice(e.target.value)}
                                >
                                    <option value="alloy">Alloy</option>
                                    <option value="echo">Echo</option>
                                    <option value="fable">Fable</option>
                                </select>
                                <button onClick={handleTTS} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${isPlayingAudio ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                    {isPlayingAudio ? <Pause size={16}/> : <Volume2 size={16}/>} 
                                    {isPlayingAudio ? 'Stop' : 'Listen'}
                                </button>
                            </div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleAnswerSubmit} className="bg-white p-2 rounded-xl shadow-lg border relative">
                            <textarea 
                                className="w-full border-none focus:ring-0 resize-none p-3 text-gray-700 min-h-[80px]"
                                placeholder="Type your answer here..."
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={isSubmitting}
                            ></textarea>
                            <div className="flex justify-between items-center px-3 pb-2">
                                {feedback && (
                                    <span className={`text-xs font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.text}
                                    </span>
                                )}
                                <button type="submit" disabled={isSubmitting || !userAnswer.trim()} className="ml-auto bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* AI Tutor Panel */}
            <aside className={`hidden lg:flex flex-col w-72 bg-white border-l z-30 ${aiTutorOpen ? 'block' : ''}`}> 
                 {/* ... AI Tutor UI using tutorMessages and handleTutorAsk ... */}
            </aside>
            
            {/* Mobile AI Tutor Modal implementation similar to above ... */}
        </div>
    );
}
