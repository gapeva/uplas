import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [signupStep, setSignupStep] = useState(1); // RESTORED: Step State
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup, isLoading, error } = useAuthStore();
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        organization: '',
        industry: '',
        otherIndustry: '',
        profession: '',
        countryCode: '+1',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    const [loginData, setLoginData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (location.state?.mode === 'signup') setActiveTab('signup');
    }, [location]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });
        const success = await login(loginData.email, loginData.password);
        if (success) navigate(location.state?.returnUrl || '/projects');
    };

    // RESTORED: Step Logic
    const nextStep = () => setSignupStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setSignupStep(prev => Math.max(prev - 1, 1));

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });

        if (signupData.password !== signupData.confirmPassword) {
            setStatusMsg({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        if (!PASSWORD_REGEX.test(signupData.password)) {
            setStatusMsg({ type: 'error', text: 'Password requirements not met.' });
            return;
        }

        const res = await signup(signupData);
        if (res.success) {
            setStatusMsg({ type: 'success', text: 'Registration successful! Please log in.' });
            setTimeout(() => {
                setActiveTab('login');
                setLoginData(prev => ({ ...prev, email: signupData.email }));
            }, 2000);
        }
    };

    return (
        <section className="auth-section py-16 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-md w-full">
                
                <div className="flex justify-center mb-6">
                    <img src="/images/logo-u.svg.png" alt="Uplas" className="h-12 w-auto" />
                </div>

                <div className="flex mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'signup' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'login' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                    {(error || statusMsg.text) && (
                        <div className={`mb-4 p-3 rounded text-sm ${error || statusMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {error || statusMsg.text}
                        </div>
                    )}

                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Welcome Back!</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" required className="w-full px-4 py-2 border rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" required className="w-full px-4 py-2 border rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                            </div>
                            <div className="text-right"><Link to="/forgot-password" class="text-sm text-[#00b4d8]">Forgot password?</Link></div>
                            <button type="submit" disabled={isLoading} className="w-full py-2.5 px-4 bg-[#00b4d8] text-white font-bold rounded-md hover:bg-[#0096c7]">
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-2 text-center text-gray-800">Create Account</h3>
                            <p className="text-sm text-gray-500 text-center mb-4">Step {signupStep} of 5</p>

                            {/* Step 1: Basic Info */}
                            {signupStep === 1 && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" required className="w-full px-4 py-2 border rounded-md mb-4" 
                                        value={signupData.fullName} onChange={(e) => setSignupData({...signupData, fullName: e.target.value})} />
                                    <button type="button" onClick={nextStep} className="w-full py-2 bg-[#00b4d8] text-white rounded-md flex justify-center items-center gap-2">
                                        Next <ChevronRight size={16}/>
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Contact */}
                            {signupStep === 2 && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" required className="w-full px-4 py-2 border rounded-md mb-4" 
                                        value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={prevStep} className="w-1/3 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>
                                        <button type="button" onClick={nextStep} className="w-2/3 py-2 bg-[#00b4d8] text-white rounded-md flex justify-center items-center gap-2">Next <ChevronRight size={16}/></button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Professional */}
                            {signupStep === 3 && (
                                <div className="animate-fade-in space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization (Optional)</label>
                                        <input type="text" className="w-full px-4 py-2 border rounded-md" 
                                            value={signupData.organization} onChange={(e) => setSignupData({...signupData, organization: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                                        <select className="w-full px-4 py-2 border rounded-md"
                                            value={signupData.industry} onChange={(e) => setSignupData({...signupData, industry: e.target.value})}>
                                            <option value="">Select...</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {signupData.industry === 'Other' && (
                                        <input type="text" placeholder="Specify Industry" className="w-full px-4 py-2 border rounded-md"
                                            value={signupData.otherIndustry} onChange={(e) => setSignupData({...signupData, otherIndustry: e.target.value})} />
                                    )}
                                    <div className="flex gap-2 mt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>
                                        <button type="button" onClick={nextStep} className="w-2/3 py-2 bg-[#00b4d8] text-white rounded-md flex justify-center items-center gap-2">Next <ChevronRight size={16}/></button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Goals/Phone */}
                            {signupStep === 4 && (
                                <div className="animate-fade-in space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Profession</label>
                                        <input type="text" required className="w-full px-4 py-2 border rounded-md" 
                                            value={signupData.profession} onChange={(e) => setSignupData({...signupData, profession: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <div className="flex gap-2">
                                            <select className="w-1/3 px-2 py-2 border rounded-md" value={signupData.countryCode} onChange={(e) => setSignupData({...signupData, countryCode: e.target.value})}>
                                                <option value="+1">+1</option><option value="+254">+254</option>
                                            </select>
                                            <input type="tel" required className="w-2/3 px-4 py-2 border rounded-md" placeholder="712345678"
                                                value={signupData.phone} onChange={(e) => setSignupData({...signupData, phone: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>
                                        <button type="button" onClick={nextStep} className="w-2/3 py-2 bg-[#00b4d8] text-white rounded-md flex justify-center items-center gap-2">Next <ChevronRight size={16}/></button>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Security */}
                            {signupStep === 5 && (
                                <div className="animate-fade-in space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input type="password" required className="w-full px-4 py-2 border rounded-md" 
                                            value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                        <input type="password" required className="w-full px-4 py-2 border rounded-md" 
                                            value={signupData.confirmPassword} onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="terms" required checked={signupData.terms} onChange={(e) => setSignupData({...signupData, terms: e.target.checked})} />
                                        <label htmlFor="terms" className="text-sm">Agree to <Link to="/terms" className="text-blue-500">Terms</Link></label>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>
                                        <button type="submit" disabled={isLoading} className="w-2/3 py-2 bg-[#00b4d8] text-white font-bold rounded-md hover:bg-[#0096c7]">
                                            {isLoading ? 'Creating...' : 'Create Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AuthPage;
