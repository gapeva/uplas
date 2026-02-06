import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, Tag, Share2 } from 'lucide-react';
import api from '../lib/api';

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/blog/posts/${slug}/`).then(res => {
            setPost(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [slug]);

    if (loading) return <div className="py-20 text-center">Loading article...</div>;
    if (!post) return <div className="py-20 text-center">Article not found.</div>;

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gray-50 py-16">
                <div className="container max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {post.category?.name || 'Technology'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
                    
                    <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                        <span className="flex items-center gap-2"><User size={16}/> {post.author?.full_name || 'Uplas Team'}</span>
                        <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(post.published_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><Clock size={16}/> {post.reading_time || '5 min'} read</span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="container max-w-5xl mx-auto px-4 -mt-8 mb-12">
                <img 
                    src={post.featured_image_url || "https://placehold.co/1200x500/3d405b/FFFFFF?text=Featured+Image"} 
                    alt={post.title}
                    className="w-full rounded-2xl shadow-xl"
                />
            </div>

            {/* Content */}
            <div className="container max-w-3xl mx-auto px-4 pb-20">
                <article className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: post.content_html || post.content }} />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                    {post.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-600">
                            <Tag size={14}/> {tag}
                        </span>
                    ))}
                </div>

                {/* Author Bio */}
                <div className="mt-12 bg-gray-50 p-8 rounded-xl flex items-start gap-6">
                    <img 
                        src={post.author?.profile_picture_url || "https://placehold.co/100x100"} 
                        className="w-16 h-16 rounded-full object-cover" 
                        alt="Author"
                    />
                    <div>
                        <h3 className="font-bold text-lg mb-2">About {post.author?.full_name}</h3>
                        <p className="text-gray-600 text-sm">
                            {post.author_bio?.description || "Lead Content Writer and AI Researcher at Uplas."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
