import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Menu, X, CheckCircle, Lock, Play, MessageSquare, 
    Volume2, Video, Bookmark, Send, Settings, BookOpen, Pause, FileText
} from 'lucide-react';
import api from '../lib/api';
// Ensure mcourse.css is imported in main.jsx or here
import '../styles/mcourse.css'; 

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

    if (loading) return <div className="loading-container">Loading classroom...</div>;

    return (
        /* Legacy Wrapper: mcourse-main-content */
        <main className="mcourse-main-content" id="main-content-area" role="main">
            <div className="learning-environment-grid">
                
                {/* --- LEFT SIDEBAR (Legacy Class: learning-sidebar learning-sidebar--left) --- */}
                <aside className={`learning-sidebar learning-sidebar--left ${!sidebarOpen ? 'hidden-mobile' : ''}`}>
                    <div className="sidebar-section">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="sidebar-title">Course Navigation</h3>
                            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500"><X size={20}/></button>
                        </div>
                        
                        <nav id="course-module-topic-nav" className="module-topic-nav">
                            {courseNav?.modules?.map((module, i) => (
                                <div key={module.id} className="module-group mb-4">
                                    <h4 className="module-title-btn text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">
                                        Module {i+1}: {module.title}
                                    </h4>
                                    <ul className="topic-list-nav space-y-1">
                                        {module.topics?.map(topic => (
                                            <li key={topic.id}>
                                                <Link 
                                                    to={`/courses/${courseSlug}/learn/${topic.id}`}
                                                    className={`topic-link-nav flex items-center justify-between p-2 rounded text-sm transition ${
                                                        currentTopic?.id === topic.id ? 'active bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                                    } ${topic.is_locked ? 'locked opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <span className="truncate">{topic.title}</span>
                                                    {topic.is_completed ? <CheckCircle size={14} className="text-green-500"/> : topic.is_locked ? <Lock size={14} className="text-gray-400"/> : <div className="w-3.5 h-3.5 border rounded-full"></div>}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Your Progress</h3>
                        <div className="progress-overview-simple">
                            <p><span>Topic Completion:</span> <strong id="topic-progress-percentage">{progress.percentage || 0}%</strong></p>
                            <div className="progress-bar-container small-progress w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="progress-bar-fill bg-green-500 h-2 rounded-full" id="topic-progress-bar" style={{ width: `${progress.percentage || 0}%` }}></div>
                            </div>
                            <p><span>XP Points:</span> <strong id="user-xp-points">{progress.xp || 0}</strong></p>
                            <p><span>Badges:</span> <strong id="user-badges-count">{progress.badges || 0}</strong></p>
                        </div>
                    </div>
                </aside>

                {/* --- CENTER: INTERACTION AREA (Legacy Class: learning-interaction-area) --- */}
                <section className="learning-interaction-area" aria-labelledby="current-topic-title-main">
                    
                    {/* Header */}
                    <header className="topic-header-main flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600"><Menu/></button>
                            <h2 id="current-topic-title-main" className="current-topic-title-text text-2xl font-bold text-gray-800">
                                {currentTopic?.title}
                            </h2>
                        </div>
                        <div className="topic-actions flex gap-2">
                            <button className="topic-action-btn p-2 text-gray-500 hover:text-blue-600" title="Bookmark">
                                <Bookmark size={20} />
                            </button>
                            <button className="topic-action-btn p-2 text-gray-500 hover:text-blue-600" title="Discuss">
                                <MessageSquare size={20} />
                            </button>
                        </div>
                    </header>

                    {/* Chat / Content Area */}
                    <div className="qna-content-area space-y-4 mb-6" id="qna-content-area" role="log">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-bubble ${msg.role === 'user' ? 'user-answer-bubble ml-auto bg-[#00b4d8] text-white' : 'ai-question-bubble mr-auto bg-white border border-gray-200 text-gray-800'} max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            </div>
                        ))}
                    </div>

                    {/* Media Controls */}
                    <div className="media-controls-area bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="tts-controls flex items-center gap-3">
                            <select 
                                id="tts-voice-character-select"
                                className="form__select form__select--compact bg-gray-100 border-none rounded-lg text-sm px-3 py-2 cursor-pointer"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                            >
                                <option value="alloy">Alloy</option>
                                <option value="echo">Echo</option>
                                <option value="fable">Fable</option>
                            </select>
                            <button 
                                id="play-tts-btn"
                                onClick={handleTTS} 
                                className={`button button--secondary button--small media-control-button flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${isPlayingAudio ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}
                            >
                                {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />} 
                                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
                            </button>
                        </div>
                        <div className="ttv-controls">
                            <button 
                                id="generate-ttv-btn"
                                className="button button--secondary button--small media-control-button flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-blue-100 text-[#00b4d8] hover:bg-blue-200 transition"
                                onClick={() => setShowVideoModal(true)} 
                            >
                                <Video size={16} />
                                <span>Watch Video</span>
                            </button>
                        </div>
                    </div>

                    {/* Answer Form */}
                    <form id="user-answer-form" className="user-input-form bg-white p-2 rounded-xl shadow-lg border relative" onSubmit={handleAnswerSubmit}>
                        <textarea 
                            id="user-answer-input"
                            className="form__textarea w-full border-none focus:ring-0 resize-none p-3 text-gray-700 min-h-[80px]"
                            placeholder="Type your answer here..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={isSubmitting}
                        ></textarea>
                        <div className="flex justify-between items-center px-3 pb-2">
                            {feedback && (
                                <span className={`answer-feedback-display text-xs font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {feedback.text}
                                </span>
                            )}
                            <button type="submit" className="button button--primary ml-auto bg-[#00b4d8] text-white p-2 rounded-lg hover:bg-[#0096c7]" disabled={isSubmitting || !userAnswer.trim()}>
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </section>

                {/* --- RIGHT SIDEBAR: AI TUTOR (Legacy Class: learning-sidebar learning-sidebar--right) --- */}
                <aside className="learning-sidebar learning-sidebar--right hidden lg:block">
                    <div className="sidebar-section ai-tutor-panel-preview">
                        <h3 className="sidebar-title flex items-center gap-2">
                            <Settings size={18} className="text-[#00b4d8]"/> AI Tutor
                        </h3>
                        
                        <div className="ai-tutor-messages-area flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 h-[400px] mb-4 border rounded">
                            {tutorMessages.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-white shadow-sm mr-4'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTutorThinking && <div className="text-xs text-gray-400 italic">Thinking...</div>}
                        </div>

                        <form id="ai-tutor-input-form" className="ai-tutor-input-area flex gap-2" onSubmit={handleTutorAsk}>
                            <input 
                                type="text" 
                                id="ai-tutor-message-input"
                                value={tutorQuery}
                                onChange={(e) => setTutorQuery(e.target.value)}
                                className="form__input flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                                placeholder="Ask the tutor..." 
                            />
                            <button type="submit" className="button button--primary bg-[#00b4d8] text-white p-2 rounded-lg"><Send size={18}/></button>
                        </form>
                        
                        <div className="sidebar-section mt-6">
                            <h3 className="sidebar-title">Topic Resources</h3>
                            <ul id="topic-resources-list" className="resource-list-sidebar space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="flex items-center gap-2 hover:text-blue-500"><FileText size={14}/> Key Definitions PDF</a></li>
                                <li><a href="#" className="flex items-center gap-2 hover:text-blue-500"><BookOpen size={14}/> Further Reading</a></li>
                            </ul>
                        </div>
                    </div>
                </aside>
                
                {/* --- MOBILE AI TUTOR MODAL --- */}
                {aiTutorOpen && (
                    <div className="lg:hidden absolute inset-0 z-50 bg-black/50">
                        <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center bg-blue-50/50">
                                <h3 className="font-bold text-gray-800">AI Tutor</h3>
                                <button onClick={() => setAiTutorOpen(false)}><X size={20}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {tutorMessages.map((msg, i) => (
                                    <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>{msg.text}</div>
                                ))}
                            </div>
                            <form className="p-3 border-t flex gap-2" onSubmit={handleTutorAsk}>
                                <input type="text" value={tutorQuery} onChange={(e)=>setTutorQuery(e.target.value)} className="flex-1 border rounded px-2" placeholder="Ask AI..."/>
                                <button type="submit" className="bg-[#00b4d8] text-white p-2 rounded"><Send size={18}/></button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* --- VIDEO MODAL (TTV) --- */}
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
                             <div className="text-center">
                                <Video size={64} className="mx-auto mb-4 text-[#00b4d8] opacity-50"/>
                                <h3 className="text-xl font-bold">AI Video Lesson</h3>
                                <p className="text-gray-400 mt-2">Generating visual explanation for: <span className="text-white italic">"{currentTopic?.title}"</span></p>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
