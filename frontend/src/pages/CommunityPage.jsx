import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MessageSquare, Users, Globe, User, PlusCircle, 
    TrendingUp, Hash, MoreHorizontal, ThumbsUp, MessageCircle 
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function CommunityPage() {
    const { user } = useAuthStore();
    const [threads, setThreads] = useState([]);
    const [forums, setForums] = useState([]); // Categories
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // all, following, etc.
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [threadsRes, forumsRes] = await Promise.all([
                    api.get('/community/threads/'),
                    api.get('/community/forums/')
                ]);
                setThreads(threadsRes.data.results || threadsRes.data);
                setForums(forumsRes.data.results || forumsRes.data);
            } catch (err) {
                console.error("Failed to load community data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-4 pb-12">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* --- LEFT SIDEBAR (Navigation) --- */}
                <aside className="lg:col-span-1 space-y-6">
                    {/* Create Post Widget */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <button 
                            onClick={() => setIsPostModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold transition"
                        >
                            <PlusCircle size={20} /> Create Post
                        </button>
                    </div>

                    {/* Feed Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-800 mb-3 px-2">My Feed</h3>
                        <nav className="space-y-1">
                            <SidebarItem 
                                icon={Globe} 
                                label="All Posts" 
                                active={activeFilter === 'all'} 
                                onClick={() => setActiveFilter('all')} 
                            />
                            <SidebarItem 
                                icon={Users} 
                                label="Following" 
                                active={activeFilter === 'following'} 
                                onClick={() => setActiveFilter('following')} 
                            />
                        </nav>
                    </div>

                    {/* Categories (Forums) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-800 mb-3 px-2">Categories</h3>
                        <nav className="space-y-1 h-64 overflow-y-auto pr-2 custom-scrollbar">
                            <SidebarItem 
                                icon={Hash} 
                                label="All Categories" 
                                onClick={() => {}} 
                            />
                            {forums.map(forum => (
                                <Link 
                                    to={`/community/forum/${forum.slug}`} 
                                    key={forum.id}
                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                    <span className="truncate text-sm">{forum.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* --- CENTER FEED (Content) --- */}
                <section className="lg:col-span-2 space-y-6">
                    {/* Feed Header */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
                        <h2 className="font-bold text-lg">Latest Discussions</h2>
                        <select className="border-none bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 focus:ring-0">
                            <option>Latest</option>
                            <option>Top Voted</option>
                            <option>Trending</option>
                        </select>
                    </div>

                    {/* Post List */}
                    {loading ? (
                        <div className="text-center py-10">Loading community feed...</div>
                    ) : threads.length > 0 ? (
                        threads.map(thread => (
                            <article key={thread.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                {/* Author Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {thread.author?.username?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{thread.author?.username || 'Anonymous'}</h4>
                                            <div className="text-xs text-gray-500">
                                                {new Date(thread.created_at).toLocaleDateString()} • {thread.forum_name || 'General'}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                                </div>

                                {/* Content */}
                                <Link to={`/community/thread/${thread.slug}`}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
                                        {thread.title}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {thread.content} {/* Note: In real app, strip HTML tags for preview */}
                                    </p>
                                </Link>

                                {/* Actions */}
                                <div className="flex items-center gap-6 border-t pt-4">
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition">
                                        <ThumbsUp size={18} />
                                        <span>{thread.like_count || 0} Likes</span>
                                    </button>
                                    <Link to={`/community/thread/${thread.slug}`} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition">
                                        <MessageCircle size={18} />
                                        <span>{thread.reply_count || 0} Replies</span>
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">No active discussions found.</p>
                        </div>
                    )}
                </section>

                {/* --- RIGHT SIDEBAR (Profile & Trending) --- */}
                <aside className="lg:col-span-1 space-y-6 hidden lg:block">
                    {/* User Profile Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4 flex items-center justify-center text-2xl">
                             {user?.full_name?.[0] || <User size={32}/>}
                        </div>
                        <h3 className="font-bold text-lg">{user?.full_name || 'Guest User'}</h3>
                        <p className="text-gray-500 text-sm mb-4">{user?.profession || 'AI Enthusiast'}</p>
                        <Link to="/dashboard" className="block w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">
                            View Profile
                        </Link>
                    </div>

                    {/* Trending Tags */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-500"/> Trending Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['#GenAI', '#MachineLearning', '#Python', '#DeepLearning', '#Ethics'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

            </div>

            {/* Create Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <header className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Create New Discussion</h3>
                            <button onClick={() => setIsPostModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </header>
                        <form className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What's on your mind?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select className="w-full border rounded-lg px-4 py-2 outline-none bg-white">
                                    <option>Select a Forum...</option>
                                    {forums.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea rows="6" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Share your insights..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Publish Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
