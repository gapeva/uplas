import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Menu, X, CheckCircle, Lock, Play, MessageSquare, 
    Volume2, Video, Bookmark, Send, Settings, BookOpen, Pause 
} from 'lucide-react';
import api from '../lib/api';

export default function LessonPage() {
    const { courseSlug, topicId } = useParams();
    
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [aiTutorOpen, setAiTutorOpen] = useState(false); // Mobile Tutor Toggle
    const [showVideoModal, setShowVideoModal] = useState(false); // TTV Modal State
    
    // Data State
    const [courseNav, setCourseNav] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    // Preserved Progress State
    const [progress, setProgress] = useState({ percentage: 0, xp: 0, badges: 0 });

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
    const [tutorMessages, setTutorMessages] = useState([{ role: 'assistant', text: "Hello! I am your personal AI Tutor." }]);
    const [isTutorThinking, setIsTutorThinking] = useState(false);

    // 1. Initial Load
    useEffect(() => {
        const loadCourseData = async () => {
            setLoading(true);
            try {
                const navRes = await api.get(`/courses/courses/${courseSlug}/navigation/`);
                setCourseNav(navRes.data);
                
                // Update progress state if available in response
                if (navRes.data.progress) {
                    setProgress({ percentage: navRes.data.progress, xp: 0, badges: 0 });
                }
                
                let effectiveTopicId = topicId;
                if (!effectiveTopicId && navRes.data.modules.length > 0) {
                    effectiveTopicId = navRes.data.modules[0].topics[0].id;
                }

                if (effectiveTopicId) {
                    await loadTopicContent(effectiveTopicId);
                }
            } catch (err) {
                console.error("Failed to load course navigation", err);
            } finally {
                setLoading(false);
            }
        };
        loadCourseData();
    }, [courseSlug]);

    // 2. Load Specific Topic
    useEffect(() => {
        if (topicId) {
            loadTopicContent(topicId);
        }
    }, [topicId]);

    const loadTopicContent = async (tId) => {
        try {
            const res = await api.get(`/courses/topics/${tId}/`);
            setCurrentTopic(res.data);
            
            // Reset Interaction State
            setMessages([]);
            setFeedback(null);
            setUserAnswer('');
            setAudioUrl(null);
            setIsPlayingAudio(false);
            
            const initialMsg = res.data.content_html || res.data.description || "Welcome to this lesson.";
            setMessages([{ role: 'assistant', text: initialMsg }]);

        } catch (err) {
            console.error("Error loading topic", err);
        }
    };

    // 3. Handle Answer Submission
    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if(!userAnswer.trim()) return;

        const pendingAnswer = userAnswer;
        setMessages(prev => [...prev, { role: 'user', text: pendingAnswer }]);
        setUserAnswer('');
        setIsSubmitting(true);

        try {
            const res = await api.post(`/courses/topics/${currentTopic.id}/submit_answer/`, {
                answer: pendingAnswer
            });
            const { is_correct, feedback: aiFeedback, xp_awarded } = res.data;
            setMessages(prev => [...prev, { role: 'assistant', text: aiFeedback }]);
            setFeedback({ 
                type: is_correct ? 'success' : 'error', 
                text: is_correct ? `Correct! +${xp_awarded} XP` : 'Incorrect, try again.' 
            });
        } catch (err) {
            setFeedback({ type: 'error', text: 'Submission failed.' });
            setUserAnswer(pendingAnswer);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Handle Text-To-Speech
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

        const textToRead = messages.length > 0 ? messages[messages.length - 1].text : currentTopic?.description;
        if (!textToRead) return;

        try {
            const res = await api.post('/ai_agents/tts/', {
                text: textToRead,
                voice_settings: { voice_id: selectedVoice }
            });
            const newAudioUrl = res.data.audio_url; 
            setAudioUrl(newAudioUrl);
            
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

    // 5. Handle AI Tutor
    const handleTutorAsk = async (e) => {
        e.preventDefault();
        if (!tutorQuery.trim()) return;

        const q = tutorQuery;
        setTutorMessages(prev => [...prev, { role: 'user', text: q }]);
        setTutorQuery('');
        setIsTutorThinking(true);

        try {
            const res = await api.post('/ai_agents/nlp-tutor/', {
                query_text: q,
                course_context: { course_id: courseSlug, topic_id: currentTopic?.id }
            });
            const tutorResponse = res.data.response_text || res.data.message || "I processed your request.";
            setTutorMessages(prev => [...prev, { role: 'assistant', text: tutorResponse }]);
        } catch (err) {
            setTutorMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting." }]);
        } finally {
            setIsTutorThinking(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading classroom...</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden relative">
            
            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 truncate" title={courseNav?.title}>{courseNav?.title}</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {courseNav?.modules?.map((module, i) => (
                        <div key={module.id}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Module {i+1}: {module.title}</h3>
                            <ul className="space-y-1">
                                {module.topics?.map(topic => (
                                    <li key={topic.id}>
                                        <Link 
                                            to={`/courses/${courseSlug}/learn/${topic.id}`}
                                            className={`flex items-center justify-between p-2 rounded text-sm transition ${
                                                currentTopic?.id === topic.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                            } ${topic.is_locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="truncate">{topic.title}</span>
                                            {topic.is_completed ? <CheckCircle size={14} className="text-green-500"/> : topic.is_locked ? <Lock size={14} className="text-gray-400"/> : <div className="w-3.5 h-3.5 border rounded-full"></div>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- RESTORED: Progress Section --- */}
                <div className="p-5 border-t bg-gray-50">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Your Progress</h4>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span className="font-bold">{progress.percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress.percentage || 0}%` }}></div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600"><Menu/></button>
                        <h1 className="text-lg font-bold text-gray-800 truncate">{currentTopic?.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition" title="Bookmark"><Bookmark size={20} /></button>
                        {/* Wired "Discuss" button to Mobile AI Tutor */}
                        <button 
                            className={`p-2 rounded-full transition ${aiTutorOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                            title="Discuss / AI Tutor"
                            onClick={() => setAiTutorOpen(!aiTutorOpen)}
                        >
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </header>

                {/* Content & QnA Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
                    <div className="max-w-3xl mx-auto space-y-6">
                        
                        {/* Chat History */}
                        <div className="space-y-4 mb-8">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-[#00b4d8] text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border rounded-bl-none'
                                    }`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Media Controls */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <select 
                                    className="bg-gray-100 border-none rounded-lg text-sm px-3 py-2 cursor-pointer"
                                    value={selectedVoice}
                                    onChange={(e) => setSelectedVoice(e.target.value)}
                                >
                                    <option value="alloy">Alloy</option>
                                    <option value="echo">Echo</option>
                                    <option value="fable">Fable</option>
                                </select>
                                <button onClick={handleTTS} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${isPlayingAudio ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                    {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />} 
                                    {isPlayingAudio ? 'Stop' : 'Listen'}
                                </button>

                                {/* FIX: Functional TTV Button */}
                                <button 
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-blue-100 text-[#00b4d8] hover:bg-blue-200 transition"
                                    onClick={() => setShowVideoModal(true)} 
                                >
                                    <Video size={16} />
                                    <span>Watch Video</span>
                                </button>
                            </div>
                        </div>

                        {/* User Input Area */}
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
                                <button type="submit" disabled={isSubmitting || !userAnswer.trim()} className="ml-auto bg-[#00b4d8] text-white p-2 rounded-lg hover:bg-[#0096c7] disabled:opacity-50">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* --- RIGHT SIDEBAR (AI Tutor - Desktop) --- */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-l z-30">
                <div className="p-5 border-b bg-blue-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><Settings size={18} className="text-[#00b4d8]"/> AI Tutor</h3>
                    <p className="text-xs text-gray-600">Ask any questions about this topic.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                     {tutorMessages.map((msg, i) => (
                        <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-white shadow-sm mr-4'}`}>
                            {msg.text}
                        </div>
                     ))}
                     {isTutorThinking && <div className="text-xs text-gray-400 italic">Thinking...</div>}
                </div>
                <form onSubmit={handleTutorAsk} className="p-3 bg-white border-t flex gap-2">
                    <input 
                        type="text" 
                        value={tutorQuery}
                        onChange={(e) => setTutorQuery(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                        placeholder="Ask the tutor..." 
                    />
                    <button type="submit" className="bg-[#00b4d8] text-white p-2 rounded-lg"><Send size={18}/></button>
                </form>
            </aside>

            {/* --- MOBILE AI TUTOR (Slide-over / Modal) --- */}
            {aiTutorOpen && (
                <div className="lg:hidden absolute inset-0 z-50 bg-black/50">
                    <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl flex flex-col animate-slide-in">
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings size={18} className="text-[#00b4d8]"/> AI Tutor</h3>
                            <button onClick={() => setAiTutorOpen(false)} className="text-gray-500 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                            {tutorMessages.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-white shadow-sm mr-4'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTutorThinking && <div className="text-xs text-gray-400 italic">Thinking...</div>}
                        </div>
                        <form onSubmit={handleTutorAsk} className="p-3 bg-white border-t flex gap-2">
                            <input 
                                type="text" 
                                value={tutorQuery}
                                onChange={(e) => setTutorQuery(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                                placeholder="Ask AI..." 
                            />
                            <button type="submit" className="bg-[#00b4d8] text-white p-2 rounded-lg"><Send size={18}/></button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- VIDEO MODAL (TTV Implementation) --- */}
            {showVideoModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button 
                            onClick={() => setShowVideoModal(false)}
                            className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-black/50 rounded-full p-2"
                        >
                            <X size={24} />
                        </button>
                        <div className="aspect-video flex items-center justify-center bg-gray-900 text-white">
                             {/* Placeholder for actual TTV stream or Video URL */}
                             <div className="text-center">
                                <Video size={64} className="mx-auto mb-4 text-[#00b4d8] opacity-50"/>
                                <h3 className="text-xl font-bold">AI Video Lesson</h3>
                                <p className="text-gray-400 mt-2">Generating visual explanation for: <span className="text-white italic">"{currentTopic?.title}"</span></p>
                                <p className="text-xs text-gray-500 mt-4">(Integration ready: Connect backend TTV stream source here)</p>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
