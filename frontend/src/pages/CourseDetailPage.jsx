import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import api from '../lib/api';
import { useUplas } from '../contexts/UplasContext';

export default function CourseDetailPage() {
    const { slug } = useParams();
    const { user } = useUplas();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get(`/courses/courses/${slug}/`);
                setCourse(res.data);
                // Check enrollment if logged in (logic depends on how you store enrollments in user profile or separate endpoint)
                // For now, simple check if user is logged in
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    const handleEnroll = async () => {
        if(!user) return window.location.href = '/login';
        try {
            // Backend needs an enrollment endpoint, assuming simple POST for now
            await api.post(`/courses/courses/${course.id}/enroll/`);
            setIsEnrolled(true);
        } catch (err) {
            alert("Enrollment failed or already enrolled.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!course) return <div className="p-10 text-center">Course not found.</div>;

    return (
        <div className="py-12 container">
            <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                    <p className="text-lg text-gray-600 mb-6">{course.long_description}</p>
                    
                    <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                    <div className="space-y-4">
                        {course.modules?.map((module) => (
                            <div key={module.id} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                                <div className="space-y-2">
                                    {module.topics?.map(topic => (
                                        <div key={topic.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-3">
                                                <PlayCircle size={16} />
                                                <span>{topic.title}</span>
                                            </div>
                                            {topic.is_previewable || isEnrolled ? (
                                                <Link to={`/courses/${course.slug}/learn/${topic.id}`} className="text-primary text-sm underline">
                                                    Start
                                                </Link>
                                            ) : (
                                                <Lock size={14} className="text-gray-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="card p-6 sticky top-24 border shadow-lg rounded-xl">
                        <img src={course.thumbnail_url || "/images/default-course.png"} className="w-full rounded mb-4" />
                        <div className="text-3xl font-bold mb-4">
                            {course.price > 0 ? `$${course.price}` : 'Free'}
                        </div>
                        <button 
                            onClick={handleEnroll}
                            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition"
                        >
                            {isEnrolled ? "Continue Learning" : "Enroll Now"}
                        </button>
                        <ul className="mt-6 space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2"><CheckCircle size={16} /> {course.level} Level</li>
                            <li className="flex gap-2"><CheckCircle size={16} /> {course.total_duration_minutes} Mins Content</li>
                            {course.supports_ai_tutor && <li className="flex gap-2"><CheckCircle size={16} /> AI Tutor Support</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
