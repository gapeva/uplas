// src/pages/CourseDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function CourseDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [openModuleId, setOpenModuleId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Ensure the backend URL matches the router in urls.py
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
        if (!isAuthenticated) return navigate('/login', { state: { returnUrl: `/courses/${slug}` } });
        
        setEnrolling(true);
        try {
            // Free course flow or direct enrollment check
            if (course.price <= 0) {
                await api.post(`/courses/courses/${course.id}/enroll/`);
                navigate(`/courses/${course.slug}/learn`);
                return;
            }

            // Paid course flow - Paystack
            // Note: Ensure Paystack script is loaded in index.html for window.PaystackPop to work
            if (window.PaystackPop) {
                const paystack = new window.PaystackPop();
                paystack.newTransaction({
                    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                    email: user.email,
                    amount: course.price * 100, // Amount in kobo
                    onSuccess: async (transaction) => {
                        // In a real app, send transaction.reference to backend to verify and enroll
                        await api.post(`/courses/courses/${course.id}/enroll/`, { reference: transaction.reference });
                        navigate(`/courses/${course.slug}/learn`);
                    },
                    onCancel: () => {
                        alert("Payment cancelled");
                        setEnrolling(false);
                    }
                });
            } else {
                alert("Payment system not loaded. Please try again later.");
                setEnrolling(false);
            }
        } catch (err) {
            console.error("Enrollment failed", err);
            // If already enrolled (400 Bad Request), just go to learning
            if (err.response?.status === 400 && err.response?.data?.message === "Already enrolled") {
                navigate(`/courses/${course.slug}/learn`);
            } else {
                alert("Failed to enroll. Please try again.");
            }
            setEnrolling(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading course details...</div>;
    if (!course) return <div className="p-20 text-center">Course not found.</div>;

    const isEnrolled = course.is_enrolled || (course.students && course.students.includes(user?.id));

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider mb-4 inline-block">
                        {course.category?.name || 'Development'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mb-6">{course.short_description}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm font-medium">
                        <span className="flex items-center gap-2">Level: {course.level}</span>
                        <span className="flex items-center gap-2">Students: {course.total_enrollments}</span>
                        <span className="flex items-center gap-2">Rating: {course.average_rating} ★</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-[-3rem] grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Overview */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Course</h2>
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            {course.long_description}
                        </div>
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
                                        <span className="text-sm text-gray-500">{module.topics?.length || 0} Topics</span>
                                    </button>
                                    
                                    {openModuleId === module.id && (
                                        <div className="bg-white divide-y divide-gray-100">
                                            {module.topics?.map((topic) => (
                                                <div key={topic.id} className="p-4 flex items-center justify-between hover:bg-blue-50/50 transition">
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <PlayCircle size={16} className="text-blue-600" />
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
                                    src={course.thumbnail_url || "https://placehold.co/600x400"} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    {course.price > 0 ? `$${course.price}` : 'Free'}
                                </span>
                            </div>

                            <button 
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg mb-4 disabled:opacity-70"
                            >
                                {enrolling ? 'Processing...' : (isEnrolled ? "Continue Learning" : "Enroll Now")}
                            </button>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-3"><CheckCircle size={16} className="text-green-500"/> Lifetime access</li>
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
