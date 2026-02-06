import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import api from '../lib/api';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/blog/posts/')
           .then(res => setPosts(res.data.results || res.data))
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center">Loading articles...</div>;

    return (
        <div className="py-16 container">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Insights & Updates</h1>
                <p className="text-gray-600">The latest news, tutorials, and trends in AI.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map(post => (
                    <article key={post.id} className="flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                        <Link to={`/blog/${post.slug}`} className="h-56 bg-gray-200 overflow-hidden">
                            <img 
                                src={post.featured_image || "https://placehold.co/600x400?text=Article"} 
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                            />
                        </Link>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                    {post.category?.name || 'Tech'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 hover:text-primary transition">
                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>{post.author?.full_name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
