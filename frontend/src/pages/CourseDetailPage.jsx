import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    CheckCircle, PlayCircle, Lock, ChevronDown, ChevronUp, 
    Clock, FileText, Award, Globe, AlertCircle, Star, Video 
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function CourseDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [openModuleIds, setOpenModuleIds] = useState([]);

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

    

    // Toggle a single module's accordion
    const toggleModule = (id) => {
        setOpenModuleIds(prev => 
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const scriptId = 'paystack-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://js.paystack.co/v1/inline.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            return navigate('/login', { state: { returnUrl: `/courses/${slug}` } });
        }
        
        setEnrolling(true);

        // Check availability logic
        if (course.price > 0 && !window.PaystackPop) {
             alert("Payment gateway is loading. Please wait a moment and try again.");
             setEnrolling(false);
             return;
        }

    // Expand/Collapse all helper
    const toggleAllModules = () => {
        if (course.modules?.length === openModuleIds.length) {
            setOpenModuleIds([]);
        } else {
            setOpenModuleIds(course.modules.map(m => m.id));
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            // Redirect to login with return URL
            return navigate('/login', { state: { returnUrl: `/courses/${slug}` } });
        }
        
        setEnrolling(true);
        try {
            // 1. Check if Free Course
            if (!course.price || course.price <= 0) {
                await api.post(`/courses/courses/${course.id}/enroll/`);
                navigate(`/courses/${course.slug}/learn`);
                return;
            }

            // 2. Paid Course - Paystack Integration
            if (window.PaystackPop) {
                const paystack = new window.PaystackPop();
                paystack.newTransaction({
                    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // Ensure this exists in .env
                    email: user.email,
                    amount: course.price * 100, // Paystack expects amount in Kobo/Cents
                    currency: 'USD', // Adjust currency if needed (NGN, KES, USD)
                    onSuccess: async (transaction) => {
                        // Backend Verification
                        await api.post(`/courses/courses/${course.id}/enroll/`, { 
                            reference: transaction.reference 
                        });
                        alert("Enrollment successful! Welcome aboard.");
                        navigate(`/courses/${course.slug}/learn`);
                    },
                    onCancel: () => {
                        setEnrolling(false);
                        // Optional: alert("Payment cancelled.");
                    }
                });
            } else {
                alert("Payment gateway not loaded. Please refresh the page.");
                setEnrolling(false);
            }
        } catch (err) {
            console.error("Enrollment failed", err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes("Already enrolled")) {
                navigate(`/courses/${course.slug}/learn`);
            } else {
                alert("Something went wrong. Please try again.");
            }
            setEnrolling(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading course details...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500">Course not found.</div>;

    const isEnrolled = course.is_enrolled || (course.students && course.students.includes(user?.id));

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            
            {/* --- HERO SECTION --- */}
            <div className="bg-gray-900 text-white pt-12 pb-20 md:pb-28">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                        <Link to="/courses" className="hover:text-blue-400 transition">Courses</Link> 
                        <span>/</span>
                        <span className="text-gray-400">{course.category?.name || 'General'}</span> 
                        <span>/</span>
                        <span className="text-white truncate max-w-[200px]">{course.title}</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Hero Content (Left 2/3) */}
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
                                <span className="text-gray-300 flex items-center gap-1">
                                    <Globe size={14} /> English
                                </span>
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

            {/* --- MAIN CONTENT GRID --- */}
            <div className="container mx-auto px-4 max-w-7xl -mt-16 pb-20">
                <div className="grid md:grid-cols-3 gap-8 relative">
                    
                    {/* Left Column (Details) */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* "What you'll learn" Box */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">What you'll learn</h2>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {(course.learning_outcomes || [
                                    "Master the core concepts of this subject.",
                                    "Build real-world projects to add to your portfolio.",
                                    "Understand industry best practices.",
                                    "Earn a certificate of completion."
                                ]).map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start text-sm text-gray-600">
                                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Course Content / Curriculum */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                <button 
                                    onClick={toggleAllModules} 
                                    className="text-sm text-blue-600 font-bold hover:underline"
                                >
                                    {openModuleIds.length === course.modules?.length ? 'Collapse all' : 'Expand all'}
                                </button>
                            </div>
                            
                            <div className="text-sm text-gray-500 mb-4 flex gap-2">
                                <span>{course.modules?.length || 0} Modules</span> • 
                                <span>{course.modules?.reduce((acc, m) => acc + (m.topics?.length || 0), 0)} Topics</span> • 
                                <span>12h 30m Total Length</span>
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
                                                            <span className="text-xs text-gray-400">05:20</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 marker:text-blue-500">
                                <li>Basic understanding of computer usage.</li>
                                <li>No prior experience required, we start from scratch.</li>
                                <li>A desire to learn and practice!</li>
                            </ul>
                        </div>

                        {/* Description (Long) */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Description</h2>
                            <div 
                                className="prose prose-blue max-w-none text-gray-600 text-sm leading-7"
                                dangerouslySetInnerHTML={{ __html: course.description || course.long_description || "<p>No description available.</p>" }} 
                            />
                        </div>

                        {/* Instructor */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Instructor</h2>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    <img src={course.instructor?.profile_image || "https://placehold.co/100"} alt="Instructor" className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-600 underline text-lg">{course.instructor?.full_name || 'Uplas Team'}</h3>
                                    <p className="text-gray-500 text-sm mb-2">Senior AI Engineer & Educator</p>
                                    <p className="text-gray-600 text-sm">
                                        Passionate about making AI accessible to everyone. With over 10 years of experience in the tech industry, I focus on practical, real-world applications of technology.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Enrollment Card */}
                            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                                {/* Preview Video / Image */}
                                <div className="relative aspect-video bg-black cursor-pointer group" onClick={() => {/* Open Preview Modal */}}>
                                    <img 
                                        src={course.thumbnail_url || "https://placehold.co/600x400"} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition">
                                            <PlayCircle size={32} className="text-black fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <span className="text-white font-bold text-sm drop-shadow-md">Preview this course</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {course.price > 0 ? `$${course.price}` : 'Free'}
                                        </span>
                                        {course.original_price && (
                                            <span className="text-gray-400 line-through text-sm">${course.original_price}</span>
                                        )}
                                        {course.price > 0 && course.original_price && (
                                            <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded">
                                                {Math.round(((course.original_price - course.price)/course.original_price)*100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <button 
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="w-full py-3.5 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-800 transition shadow-lg mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {enrolling ? 'Processing...' : (isEnrolled ? "Go to Course" : "Enroll Now")}
                                    </button>

                                    <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex gap-3 items-center"><Video size={16} className="text-gray-400"/> 12.5 hours on-demand video</li>
                                            <li className="flex gap-3 items-center"><FileText size={16} className="text-gray-400"/> 5 articles</li>
                                            <li className="flex gap-3 items-center"><Clock size={16} className="text-gray-400"/> Full lifetime access</li>
                                            <li className="flex gap-3 items-center"><Globe size={16} className="text-gray-400"/> Access on mobile and TV</li>
                                            <li className="flex gap-3 items-center"><Award size={16} className="text-gray-400"/> Certificate of completion</li>
                                        </ul>
                                    </div>

                                    {/* Action Links */}
                                    <div className="flex justify-between mt-6 pt-6 border-t border-gray-100 text-sm font-bold underline">
                                        <button className="text-gray-600 hover:text-black">Share</button>
                                        <button className="text-gray-600 hover:text-black">Gift this course</button>
                                        <button className="text-gray-600 hover:text-black">Apply Coupon</button>
                                    </div>
                                </div>
                            </div>

                            {/* Business/Team Upsell */}
                            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-2">Training 5 or more people?</h3>
                                <p className="text-sm text-gray-600 mb-4">Get your team access to Uplas's top 2,000+ courses anytime, anywhere.</p>
                                <button className="w-full py-2 border border-black text-black font-bold rounded hover:bg-gray-50 transition text-sm">
                                    Try Uplas for Business
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
