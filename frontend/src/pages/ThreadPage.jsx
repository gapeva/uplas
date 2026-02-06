import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function ThreadPage() {
    const { slug } = useParams();
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        // Backend: ThreadDetailView
        api.get(`/community/threads/${slug}/`).then(res => {
            setThread(res.data);
            // Assuming posts are fetched separately or included
            // If separate: api.get(`/community/threads/${res.data.id}/posts/`)
        });
    }, [slug]);

    if (!thread) return <div>Loading discussion...</div>;

    return (
        <div className="container py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
            <div className="bg-white p-6 rounded-lg border mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Posted by {thread.author.username}</span>
                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
                <div className="prose">{thread.content}</div>
            </div>

            <h3 className="text-xl font-bold mb-4">Replies</h3>
            {/* Render posts/replies here */}
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="p-4 bg-gray-50 rounded border">
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
