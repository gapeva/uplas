import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Menu, X, CheckCircle, Lock, Play, MessageSquare, 
    Volume2, Video, Bookmark, Send, Settings, BookOpen 
} from 'lucide-react';
import api from '../lib/api';

export default function LessonPage() {
    const { courseSlug, topicId } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [aiTutorOpen, setAiTutorOpen] = useState(false);
    
    // Data State
    const [courseNav, setCourseNav] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    // Interactive State
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text: '' }
    const [messages, setMessages] = useState([]); // Q&A History
    
    // TTS State
    const [selectedVoice, setSelectedVoice] = useState('alloy');
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    useEffect(() => {
        loadLessonData();
    }, [courseSlug, topicId]);

    const loadLessonData = async () => {
        setLoading(true);
        try {
            // Mocking the Navigation Data based on mcourse.html structure
            // In real app: const navRes = await api.get(`/courses/${courseSlug}/navigation/`);
            const mockNav = {
                title: "Advanced AI & Machine Learning",
                progress: 35,
                modules: [
                    {
                        id: 1, title: "AI Fundamentals", topics: [
                            { id: '1.1', title: "What is AI?", completed: true },
                            { id: '1.2', title: "Types of AI", completed: false },
                            { id: '1.3', title: "History of AI", completed: false },
                        ]
                    },
                    {
                        id: 2, title: "Machine Learning Basics", topics: [
                            { id: '2.1', title: "Supervised Learning", completed: false },
                            { id: '2.2', title: "Unsupervised Learning", completed: false, locked: true },
                        ]
                    }
                ]
            };
            setCourseNav(mockNav);

            // Mocking Topic Content
            // In real app: const topicRes = await api.get(`/courses/${courseSlug}/topics/${topicId}/`);
            setCurrentTopic({
                id: topicId || '1.1',
                title: "What is AI?",
                content: "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems.",
                initialQuestion: "Welcome! Let's start with a basic question: Can you define Artificial Intelligence in your own words?"
            });

            // Initialize chat with AI question
            setMessages([{ 
                role: 'assistant', 
                text: "Welcome! Let's start with a basic question: Can you define Artificial Intelligence in your own words?" 
            }]);

        } catch (err) {
            console.error("Error loading lesson", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        if(!userAnswer.trim()) return;

        // Add user message
        const newHistory = [...messages, { role: 'user', text: userAnswer }];
        setMessages(newHistory);
        setUserAnswer('');

        // Simulate AI Grading/Response
        setTimeout(() => {
            const aiResponse = { 
                role: 'assistant', 
                text: "That's a great definition! You correctly identified that AI simulates human intelligence. Now, let's explore the different types of AI." 
            };
            setMessages(prev => [...prev, aiResponse]);
            setFeedback({ type: 'success', text: 'Correct! +10 XP' });
        }, 1000);
    };

    const handleTTS = () => {
        setIsPlayingAudio(!isPlayingAudio);
        // Integrate actual TTS API here
        if(!isPlayingAudio) alert(`Playing text with voice: ${selectedVoice}`);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading classroom...</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
            
            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">Course Navigation</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {courseNav?.modules.map((module, i) => (
                        <div key={module.id}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Module {i+1}: {module.title}</h3>
                            <ul className="space-y-1">
                                {module.topics.map(topic => (
                                    <li key={topic.id}>
                                        <Link 
                                            to={`/courses/${courseSlug}/learn/${topic.id}`}
                                            className={`flex items-center justify-between p-2 rounded text-sm transition ${
                                                currentTopic?.id === topic.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                            } ${topic.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="truncate">{topic.title}</span>
                                            </div>
                                            {topic.completed ? <CheckCircle size={14} className="text-green-500"/> : topic.locked ? <Lock size={14} className="text-gray-400"/> : <div className="w-3.5 h-3.5 border rounded-full"></div>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t bg-gray-50">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Your Progress</h4>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span className="font-bold">{courseNav?.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${courseNav?.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>XP: <strong>1,250</strong></span>
                        <span>Badges: <strong>3</strong></span>
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
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition" title="Bookmark">
                            <Bookmark size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition" title="Discuss">
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </header>

                {/* Content & QnA Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
                    <div className="max-w-3xl mx-auto space-y-6">
                        
                        {/* Q&A / Chat Interface */}
                        <div className="space-y-4 mb-8">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Media Controls */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <select 
                                    className="bg-gray-100 border-none rounded-lg text-sm px-3 py-2 focus:ring-0 cursor-pointer"
                                    value={selectedVoice}
                                    onChange={(e) => setSelectedVoice(e.target.value)}
                                >
                                    <option value="alloy">Alloy (Neutral)</option>
                                    <option value="echo">Echo (Energetic)</option>
                                    <option value="fable">Fable (Storyteller)</option>
                                </select>
                                <button 
                                    onClick={handleTTS}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                                        isPlayingAudio ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <Volume2 size={16} /> {isPlayingAudio ? 'Stop' : 'Listen'}
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold transition">
                                <Video size={16} /> Watch Video
                            </button>
                        </div>

                        {/* User Input Area */}
                        <form onSubmit={handleAnswerSubmit} className="bg-white p-2 rounded-xl shadow-lg border relative focus-within:ring-2 ring-blue-500/50 transition">
                            <textarea 
                                className="w-full border-none focus:ring-0 resize-none p-3 text-gray-700 min-h-[80px]"
                                placeholder="Type your answer here..."
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                            ></textarea>
                            <div className="flex justify-between items-center px-3 pb-2">
                                {feedback && (
                                    <span className={`text-xs font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.text}
                                    </span>
                                )}
                                <button 
                                    type="submit" 
                                    className="ml-auto bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                                    disabled={!userAnswer.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </main>

            {/* --- RIGHT SIDEBAR (AI Tutor & Resources) --- */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-l z-30">
                
                {/* AI Tutor Panel */}
                <div className="p-5 border-b bg-blue-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                        <Settings size={18} className="text-blue-600"/> AI Tutor
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">Stuck? Need clarification? Ask the AI Tutor!</p>
                    <button 
                        onClick={() => setAiTutorOpen(true)}
                        className="w-full py-2 bg-white border border-blue-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-sm"
                    >
                        Open Tutor Chat
                    </button>
                </div>

                {/* Resources */}
                <div className="p-5 flex-1 overflow-y-auto">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Topic Resources</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition">
                                <div className="p-2 bg-gray-100 rounded-lg"><BookOpen size={16}/></div>
                                <span>Key Definitions PDF</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition">
                                <div className="p-2 bg-gray-100 rounded-lg"><Video size={16}/></div>
                                <span>Deep Dive Video</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* AI Tutor Modal (Mobile/Overlay) */}
            {aiTutorOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">🤖 AI Tutor Chat</h3>
                            <button onClick={() => setAiTutorOpen(false)}><X size={20}/></button>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                            <div className="bg-white p-3 rounded-lg shadow-sm text-sm inline-block max-w-[85%]">
                                Hello! I am your personal AI Tutor. How can I help you understand <b>{currentTopic?.title}</b> better?
                            </div>
                        </div>
                        <form className="p-3 bg-white border-t flex gap-2">
                            <input type="text" className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Ask a question..." />
                            <button className="bg-blue-600 text-white p-2 rounded-lg"><Send size={18}/></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
