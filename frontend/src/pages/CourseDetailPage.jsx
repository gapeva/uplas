// src/pages/CourseDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function CourseDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModuleId, setOpenModuleId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get(`/courses/courses/${slug}/`);
                setCourse(res.data);
                // Open first module by default
                if (res.data.modules?.length > 0) {
                    setOpenModuleId(res.data.modules[0].id);
                }
            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    const handleEnroll = async () => {
        if (!isAuthenticated) return navigate('/login');
        
        try {
            // Initiate Enrollment
            const res = await api.post(`/courses/courses/${course.id}/enroll/`);
            
            // If paid course, handle Paystack (Mock logic here, replace with real Paystack inline)
            if (course.price > 0 && window.PaystackPop) {
                const paystack = new window.PaystackPop();
                paystack.newTransaction({
                    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                    email: user.email,
                    amount: course.price * 100, // Kobo/Cents
                    onSuccess: () => navigate(`/courses/${course.slug}/learn`),
                    onCancel: () => alert("Payment cancelled")
                });
            } else {
                // Free course or direct enrollment
                navigate(`/courses/${course.slug}/learn`);
            }
        } catch (err) {
            console.error("Enrollment failed", err);
            // If already enrolled, just go to learning
            if (err.response?.status === 400) navigate(`/courses/${course.slug}/learn`);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading course details...</div>;
    if (!course) return <div className="p-20 text-center">Course not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-primary text-white py-16">
                <div className="container mx-auto px-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider mb-4 inline-block">
                        {course.category || 'Development'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mb-6">{course.short_description}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm font-medium">
                        <span className="flex items-center gap-2"><i className="fas fa-signal"></i> {course.level} Level</span>
                        <span className="flex items-center gap-2"><i className="fas fa-user-graduate"></i> {course.total_enrollments} Students</span>
                        <span className="flex items-center gap-2"><i className="fas fa-clock"></i> {course.total_duration}</span>
                        <span className="flex items-center gap-2 text-yellow-300"><i className="fas fa-star"></i> {course.rating} Rating</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-[-3rem] grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Overview */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Course</h2>
                        <div className="prose max-w-none text-gray-600 leading-relaxed" 
                             dangerouslySetInnerHTML={{ __html: course.description_html || course.long_description }} />
                    </div>

                    {/* Curriculum Accordion */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Curriculum</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module) => (
                                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => setOpenModuleId(openModuleId === module.id ? null : module.id)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            {openModuleId === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            <span className="font-semibold text-gray-800">{module.title}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{module.topics?.length} Topics</span>
                                    </button>
                                    
                                    {openModuleId === module.id && (
                                        <div className="bg-white divide-y divide-gray-100">
                                            {module.topics?.map((topic) => (
                                                <div key={topic.id} className="p-4 flex items-center justify-between hover:bg-blue-50/50 transition">
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <PlayCircle size={16} className="text-primary" />
                                                        <span className="text-sm">{topic.title}</span>
                                                    </div>
                                                    {topic.is_preview ? (
                                                        <span className="text-xs text-green-600 font-bold px-2 py-1 bg-green-100 rounded">Preview</span>
                                                    ) : (
                                                        <Lock size={14} className="text-gray-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enrollment Sidebar */}
                <div className="md:col-span-1 relative">
                    <div className="sticky top-24">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-900">
                                <img 
                                    src={course.thumbnail_url || "https://placehold.co/600x400/3498db/ffffff?text=Course"} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white drop-shadow-lg cursor-pointer hover:scale-110 transition" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    {course.price > 0 ? `$${course.price}` : 'Free'}
                                </span>
                                {course.original_price && (
                                    <span className="text-lg text-gray-400 line-through">${course.original_price}</span>
                                )}
                            </div>

                            <button 
                                onClick={handleEnroll}
                                className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/30 mb-4"
                            >
                                {course.is_enrolled ? "Continue Learning" : "Enroll Now"}
                            </button>

                            <p className="text-xs text-center text-gray-500 mb-6">
                                30-Day Money-Back Guarantee. Full Lifetime Access.
                            </p>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-3"><CheckCircle size={16} className="text-green-500"/> {course.total_duration} on-demand video</li>
                                    <li className="flex gap-3"><CheckCircle size={16} className="text-green-500"/> {course.modules?.length} downloadable resources</li>
                                    <li className="flex gap-3"><CheckCircle size={16} className="text-green-500"/> Full lifetime access</li>
                                    <li className="flex gap-3"><CheckCircle size={16} className="text-green-500"/> Certificate of completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
