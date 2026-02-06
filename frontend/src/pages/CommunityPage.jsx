import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';
import api from '../lib/api';

export default function CommunityPage() {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/community/forums/')
           .then(res => setForums(res.data.results || res.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-20 text-center">Loading community...</div>;

    return (
        <div className="py-12 container">
            <h1 className="text-4xl font-bold mb-8 text-center">Community Forums</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {forums.map(forum => (
                    <Link to={`/community/forum/${forum.id}`} key={forum.id} className="block group">
                        <div className="card p-6 border rounded-xl hover:border-primary transition bg-white">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{forum.name}</h3>
                                    <p className="text-gray-600 mb-3">{forum.description}</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span>{forum.thread_count} Threads</span>
                                        <span>{forum.post_count} Posts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
