import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    CheckCircle, PlayCircle, ChevronDown, ChevronUp, 
    Clock, FileText, Award, Globe, AlertCircle, Star, Video, X 
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import '../styles/mcourseD.css'; // Ensure legacy styles are applied

export default function CourseDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    
    // Data State
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [enrolling, setEnrolling] = useState(false);
    const [openModuleIds, setOpenModuleIds] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [isPaystackLoaded, setPaystackLoaded] = useState(false);

    // 1. Load Course Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get(`/courses/courses/${slug}/`);
                setCourse(res.data);
                
                // Open the first module by default
                if (res.data.modules?.length > 0) {
                    setOpenModuleIds([res.data.modules[0].id]);
                }
            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    // 2. Load Paystack Script Robustly
    useEffect(() => {
        const scriptId = 'paystack-script';
        if (document.getElementById(scriptId)) {
            setPaystackLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => setPaystackLoaded(true);
        script.onerror = () => console.error("Failed to load Paystack payment gateway");
        document.body.appendChild(script);
    }, []);

    // Helper: Toggle a single module's accordion
    const toggleModule = (id) => {
        setOpenModuleIds(prev => 
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    // Helper: Expand/Collapse all
    const toggleAllModules = () => {
        if (course.modules?.length === openModuleIds.length) {
            setOpenModuleIds([]);
        } else {
            setOpenModuleIds(course.modules.map(m => m.id));
        }
    };

    // 3. Handle Enrollment (Free & Paid)
    const handleEnroll = async () => {
        if (!isAuthenticated) {
            return navigate('/login', { state: { returnUrl: `/courses/${slug}` } });
        }
        
        setEnrolling(true);
        try {
            // A. Free Course
            if (!course.price || course.price <= 0) {
                await api.post(`/courses/courses/${course.id}/enroll/`);
                navigate(`/courses/${course.slug}/learn`);
                return;
            }

            // B. Paid Course - Paystack Integration
            if (!isPaystackLoaded || !window.PaystackPop) {
                 alert("Payment gateway is still loading. Please wait a second and try again.");
                 setEnrolling(false);
                 return;
            }

            const paystack = new window.PaystackPop();
            paystack.newTransaction({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, 
                email: user.email,
                amount: course.price * 100, // Paystack expects Kobo
                currency: 'USD',
                onSuccess: async (transaction) => {
                    await api.post(`/courses/courses/${course.id}/enroll/`, { 
                        reference: transaction.reference 
                    });
                    alert("Enrollment successful! Welcome aboard.");
                    navigate(`/courses/${course.slug}/learn`);
                },
                onCancel: () => {
                    setEnrolling(false);
                }
            });

        } catch (err) {
            console.error("Enrollment failed", err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes("Already enrolled")) {
                navigate(`/courses/${course.slug}/learn`);
            } else {
                alert("Something went wrong with enrollment. Please try again.");
            }
            setEnrolling(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading course details...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500">Course not found.</div>;

    const isEnrolled = course.is_enrolled || (course.students && course.students.includes(user?.id));

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            
            {/* --- HERO SECTION (From React logic, usually dynamic) --- */}
            <div className="bg-gray-900 text-white pt-12 pb-20 md:pb-28">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                        <Link to="/courses" className="hover:text-blue-400 transition">Courses</Link> 
                        <span>/</span>
                        <span className="text-gray-400">{course.category?.name || 'General'}</span> 
                        <span>/</span>
                        <span className="text-white truncate max-w-[200px]">{course.title}</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-2">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                {course.short_description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm mb-6">
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold uppercase border border-yellow-500/30">
                                    Best Seller
                                </span>
                                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                    <span>{course.average_rating || '4.8'}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" className={i < 4 ? "text-yellow-400" : "text-gray-500"} />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 font-normal ml-1">({course.total_reviews || 120} ratings)</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>Created by <span className="text-blue-400 font-semibold underline cursor-pointer">{course.instructor?.full_name || 'Uplas Team'}</span></span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><AlertCircle size={14}/> Last updated {new Date(course.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT (Wrapped in Legacy Classes) --- */}
            <main>
                <section className="course-main-content section-padding container mx-auto px-4 max-w-7xl -mt-16 pb-20">
                    <div className="container grid-container grid md:grid-cols-3 gap-8 relative">
                        
                        {/* LEFT COLUMN (Legacy Class: course-details-column) */}
                        <div className="course-details-column md:col-span-2 space-y-8">
                            
                            {/* What you'll learn */}
                            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-bold mb-4 text-gray-900">What you'll learn</h2>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {(course.learning_outcomes || [
                                        "Master the core concepts of this subject.",
                                        "Build real-world projects to add to your portfolio."
                                    ]).map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start text-sm text-gray-600">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Curriculum (Legacy Class: curriculum-list) */}
                            <div className="curriculum-list bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                    <button onClick={toggleAllModules} className="text-sm text-blue-600 font-bold hover:underline">
                                        {openModuleIds.length === course.modules?.length ? 'Collapse all' : 'Expand all'}
                                    </button>
                                </div>
                                
                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                                    {course.modules?.map((module) => (
                                        <div key={module.id} className="bg-white">
                                            <button 
                                                onClick={() => toggleModule(module.id)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {openModuleIds.includes(module.id) ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                                    <span className="font-bold text-gray-800">{module.title}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{module.topics?.length || 0} lectures</span>
                                            </button>
                                            
                                            {openModuleIds.includes(module.id) && (
                                                <div className="divide-y divide-gray-100">
                                                    {module.topics?.map((topic) => (
                                                        <div key={topic.id} className="p-3 pl-11 flex items-center justify-between hover:bg-blue-50/30 transition group cursor-pointer">
                                                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-blue-600">
                                                                {topic.video_url ? <Video size={16} /> : <FileText size={16} />}
                                                                <span className="text-sm">{topic.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {topic.is_preview && <span className="text-xs text-blue-600 underline">Preview</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Legacy Class: course-enroll-column) */}
                        <aside className="course-enroll-column md:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                
                                {/* Enroll Box (Legacy Class: course-enroll-box) */}
                                <div className="course-enroll-box bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div 
                                        className="relative aspect-video bg-black cursor-pointer group" 
                                        onClick={() => setShowPreview(true)}
                                    >
                                        <img 
                                            src={course.thumbnail_url || "https://placehold.co/600x400"} 
                                            alt={course.title} 
                                            className="course-thumbnail w-full h-full object-cover opacity-90 group-hover:opacity-75 transition"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition">
                                                <PlayCircle size={32} className="text-black fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="course-price flex items-center gap-3 mb-4 text-3xl font-bold text-gray-900">
                                            {course.price > 0 ? `$${course.price}` : 'Free'}
                                        </div>

                                        <p className="enroll-pitch text-sm text-gray-600 mb-4">
                                            Get full lifetime access to all modules, future updates, and our exclusive community channel.
                                        </p>

                                        {/* Paystack Button with Legacy Class */}
                                        <button 
                                            onClick={handleEnroll}
                                            disabled={enrolling || (course.price > 0 && !isPaystackLoaded)}
                                            className="button button--primary button--full-width paystack-button w-full py-3.5 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-800 transition shadow-lg mb-4 disabled:opacity-70"
                                        >
                                            {enrolling ? 'Processing...' : (isEnrolled ? "Go to Course" : "Enroll Now")}
                                        </button>

                                        <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                    </div>
                </section>
            </main>

            {/* --- PREVIEW MODAL --- */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button 
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-black/50 rounded-full p-2"
                        >
                            <X size={24} />
                        </button>
                        <div className="aspect-video">
                            {course.intro_video_url ? (
                                <iframe 
                                    src={course.intro_video_url.includes('youtube.com') 
                                        ? course.intro_video_url.replace("watch?v=", "embed/") 
                                        : course.intro_video_url} 
                                    title="Course Preview"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900">
                                    <Video size={48} className="mb-4 text-gray-500" />
                                    <p className="text-lg">No preview video available for this course.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
