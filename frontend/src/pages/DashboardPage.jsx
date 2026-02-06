import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Clock, PlayCircle } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({ completed: 0, inProgress: 0, certificates: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user enrollments (Adjust endpoint based on your courses/urls.py)
                const res = await api.get('/courses/enrollments/'); 
                setEnrollments(res.data.results || res.data);
                
                // Calculate mock stats (or fetch from backend if available)
                const completed = (res.data.results || res.data).filter(e => e.progress === 100).length;
                setStats({
                    completed,
                    inProgress: (res.data.results || res.data).length - completed,
                    certificates: completed // Assuming 1 cert per completed course
                });
            } catch (err) {
                console.error("Error loading dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-20 text-center">Loading dashboard...</div>;

    return (
        <div className="container py-12">
            {/* Welcome Section */}
            <div className="flex justify-between items-end mb-10 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}! 👋</h1>
                    <p className="text-gray-600">You've learned a lot this week. Keep it up!</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card p-6 border rounded-xl flex items-center gap-4 bg-blue-50 border-blue-100">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><BookOpen /></div>
                    <div>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                        <div className="text-sm text-gray-600">Courses in Progress</div>
                    </div>
                </div>
                <div className="card p-6 border rounded-xl flex items-center gap-4 bg-green-50 border-green-100">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Award /></div>
                    <div>
                        <div className="text-2xl font-bold">{stats.certificates}</div>
                        <div className="text-sm text-gray-600">Certificates Earned</div>
                    </div>
                </div>
                <div className="card p-6 border rounded-xl flex items-center gap-4 bg-purple-50 border-purple-100">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock /></div>
                    <div>
                        <div className="text-2xl font-bold">12h</div>
                        <div className="text-sm text-gray-600">Learning Hours</div>
                    </div>
                </div>
            </div>

            {/* My Courses List */}
            <h2 className="text-2xl font-bold mb-6">My Learning</h2>
            {enrollments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="card border rounded-xl overflow-hidden hover:shadow-lg transition">
                            <div className="h-40 bg-gray-200 relative">
                                <img 
                                    src={enrollment.course.thumbnail_url || "https://placehold.co/600x400?text=Course"} 
                                    className="w-full h-full object-cover" 
                                    alt={enrollment.course.title}
                                />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                                    <Link to={`/courses/${enrollment.course.slug}/learn`} className="bg-white rounded-full p-3 shadow-lg">
                                        <PlayCircle size={32} className="text-primary" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold mb-2 line-clamp-1">{enrollment.course.title}</h3>
                                
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>Progress</span>
                                    <span>{enrollment.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${enrollment.progress}%` }}
                                    ></div>
                                </div>

                                <Link 
                                    to={`/courses/${enrollment.course.slug}/learn`}
                                    className="block text-center w-full py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No courses yet?</h3>
                    <p className="text-gray-500 mb-6">Start your journey today by exploring our catalog.</p>
                    <Link to="/courses" className="button button--primary">Browse Courses</Link>
                </div>
            )}
        </div>
    );
}
