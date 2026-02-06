// src/pages/LessonPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Menu, X, CheckCircle, Lock, Play, MessageSquare, 
    Award, BookOpen, Volume2, Video 
} from 'lucide-react';
import api from '../lib/api';

export default function LessonPage() {
    const { courseSlug, topicId } = useParams(); // Updated route params
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [courseNav, setCourseNav] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiTutorOpen, setAiTutorOpen] = useState(false);

    useEffect(() => {
        loadLessonData();
    }, [courseSlug, topicId]);

    const loadLessonData = async () => {
        setLoading(true);
        try {
            // Fetch Navigation
            const navRes = await api.get(`/courses/courses/${courseSlug}/navigation/`);
            setCourseNav(navRes.data);

            // Fetch Topic Content
            // Determine topicId if not in URL (default to first)
            const activeTopicId = topicId || navRes.data.modules[0].topics[0].id;
            const topicRes = await api.get(`/courses/courses/${courseSlug}/topics/${activeTopicId}/`);
            setCurrentTopic(topicRes.data);
        } catch (err) {
            console.error("Error loading lesson", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        try {
            await api.post(`/courses/courses/${courseSlug}/topics/${currentTopic.id}/complete/`);
            setCurrentTopic({ ...currentTopic, is_completed: true });
            // Refresh nav to show checkmark
            const navRes = await api.get(`/courses/courses/${courseSlug}/navigation/`);
            setCourseNav(navRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading classroom...</div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h2 className="font-bold text-gray-800 truncate" title={courseNav?.title}>
                            {courseNav?.title || 'Course Content'}
                        </h2>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {courseNav?.modules?.map((module, idx) => (
                            <div key={module.id}>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Module {idx + 1}: {module.title}
                                </h3>
                                <ul className="space-y-1">
                                    {module.topics.map(topic => (
                                        <li key={topic.id}>
                                            <Link 
                                                to={`/courses/${courseSlug}/learn/${topic.id}`}
                                                className={`flex items-center justify-between p-2 rounded text-sm transition ${
                                                    currentTopic?.id === topic.id 
                                                        ? 'bg-primary/10 text-primary font-medium' 
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="truncate">{topic.title}</span>
                                                </div>
                                                {topic.is_completed ? (
                                                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                                                ) : topic.is_locked ? (
                                                    <Lock size={14} className="text-gray-300 shrink-0" />
                                                ) : (
                                                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"></div>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{courseNav?.progress_percent || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${courseNav?.progress_percent || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600">
                            <Menu />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800 truncate max-w-md">
                            {currentTopic?.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                            <Volume2 size={18} />
                            <span className="hidden sm:inline">Listen</span>
                        </button>
                        <button 
                            onClick={() => setAiTutorOpen(true)}
                            className="flex items-center gap-2 text-sm font-medium text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition shadow-md"
                        >
                            <MessageSquare size={18} />
                            <span>AI Tutor</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 min-h-[60vh]">
                        {/* Dynamic Content (HTML) */}
                        <div 
                            className="prose max-w-none text-gray-700 leading-8"
                            dangerouslySetInnerHTML={{ __html: currentTopic?.content_html || "<p>Content loading...</p>" }}
                        />

                        {/* Interactive Elements Placeholder (Quizzes/Videos) */}
                        {currentTopic?.video_url && (
                            <div className="mt-8 aspect-video bg-black rounded-xl overflow-hidden relative group cursor-pointer">
                                <img src={`https://img.youtube.com/vi/${currentTopic.video_id}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={64} className="text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Completion Actions */}
                    <div className="max-w-4xl mx-auto mt-8 flex justify-end">
                        <button 
                            onClick={handleMarkComplete}
                            disabled={currentTopic?.is_completed}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition ${
                                currentTopic?.is_completed 
                                ? 'bg-green-100 text-green-700 cursor-default' 
                                : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30'
                            }`}
                        >
                            {currentTopic?.is_completed ? (
                                <> <CheckCircle size={20} /> Completed </>
                            ) : (
                                <> Mark as Complete <CheckCircle size={20} /> </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            {/* AI Tutor Modal Overlay */}
            {aiTutorOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-end md:items-center justify-center md:justify-end p-4 md:p-10">
                    <div className="bg-white w-full md:w-96 h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                        <div className="bg-black text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                                <span className="font-bold">AI Tutor</span>
                            </div>
                            <button onClick={() => setAiTutorOpen(false)}><X size={20}/></button>
                        </div>
                        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shrink-0"></div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700">
                                    Hi! I'm your AI Tutor. How can I help you with <b>{currentTopic?.title}</b>?
                                </div>
                            </div>
                            {/* Chat messages would go here */}
                        </div>
                        <div className="p-4 bg-white border-t">
                            <input 
                                type="text" 
                                placeholder="Ask a question..." 
                                className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
