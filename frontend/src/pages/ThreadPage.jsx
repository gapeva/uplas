import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, User, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function ThreadPage() {
    const { slug } = useParams(); // Thread slug
    const { user } = useAuthStore();
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]); // In API 'posts' are replies
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        const fetchThreadData = async () => {
            try {
                // Fetch Thread Details
                const threadRes = await api.get(`/community/threads/${slug}/`);
                setThread(threadRes.data);

                // Fetch Posts (Replies)
                // Note: Ensure your backend endpoint matches this structure
                const postsRes = await api.get(`/community/threads/${slug}/posts/`);
                setPosts(postsRes.data.results || postsRes.data);
            } catch (err) {
                console.error("Error loading thread", err);
            } finally {
                setLoading(false);
            }
        };
        fetchThreadData();
    }, [slug]);

    const handlePostReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const res = await api.post(`/community/threads/${slug}/posts/`, {
                content: replyContent
            });
            // Append new post to list
            setPosts([...posts, res.data]);
            setReplyContent("");
        } catch (err) {
            console.error("Failed to post reply", err);
            alert("Failed to post reply.");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading discussion...</div>;
    if (!thread) return <div className="p-20 text-center">Thread not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/community" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6">
                    <ArrowLeft size={16} /> Back to Community
                </Link>

                {/* Main Thread Post */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {thread.author?.username?.[0] || 'A'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{thread.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span className="font-medium text-gray-900">{thread.author?.username}</span>
                                    <span>•</span>
                                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{thread.forum_name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="prose max-w-none text-gray-800 mb-8 whitespace-pre-line">
                            {thread.content}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-6 border-t">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                                <ThumbsUp size={20} /> <span className="text-sm font-medium">{thread.like_count} Likes</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                                <MessageCircle size={20} /> <span className="text-sm font-medium">{posts.length} Replies</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition ml-auto">
                                <Share2 size={20} /> <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Replies Area */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{posts.length} Replies</h3>
                    
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white p-5 rounded-lg border shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mt-1">
                                        {post.author?.username?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-sm text-gray-900">{post.author?.username}</span>
                                            <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
                                        
                                        <div className="flex items-center gap-4 mt-3">
                                            <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                                <ThumbsUp size={14} /> Like
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Post Reply Box */}
                <div className="bg-white rounded-xl shadow-lg border p-6 sticky bottom-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Add your reply</h3>
                    <form onSubmit={handlePostReply}>
                        <textarea 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows="3"
                            placeholder="Type your reply here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            required
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition">
                                Post Reply
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
