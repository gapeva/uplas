import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup, isLoading, error } = useAuthStore();
    
    // Status message state
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    // Signup Form State
    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        organization: '',
        industry: '',
        otherIndustry: '',
        profession: '',
        countryCode: '+1', // Default
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    // Login Form State
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Handle "Get Started" linking to signup
    useEffect(() => {
        if (location.state?.mode === 'signup') {
            setActiveTab('signup');
        }
    }, [location]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });
        const success = await login(loginData.email, loginData.password);
        if (success) {
            const destination = location.state?.returnUrl || '/projects'; 
            navigate(destination);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });

        if (signupData.password !== signupData.confirmPassword) {
            setStatusMsg({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        
        if (!PASSWORD_REGEX.test(signupData.password)) {
            setStatusMsg({ 
                type: 'error', 
                text: 'Password must be 8+ chars, include uppercase, lowercase, number, and special symbol.' 
            });
            return;
        }
        
        if (!PHONE_REGEX.test(signupData.phone)) {
            setStatusMsg({ type: 'error', text: 'Please enter a valid phone number (digits only).' });
            return;
        }

        const res = await signup(signupData);
        if (res.success) {
            setStatusMsg({ type: 'success', text: 'Registration successful! Please log in.' });
            setTimeout(() => {
                setActiveTab('login');
                setLoginData(prev => ({ ...prev, email: signupData.email }));
                setStatusMsg({ type: '', text: '' });
            }, 2000);
        }
    };

    return (
        <section className="auth-section py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-md">
                
                {/* Visual Identity - Logo Restoration */}
                <div className="flex justify-center mb-6">
                    <img src="/images/logo-u.svg.png" alt="Uplas" className="h-12 w-auto" />
                </div>

                {/* Tabs */}
                <div className="flex mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'signup' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'login' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                    
                    {(error || statusMsg.text) && (
                        <div className={`mb-4 p-3 rounded text-sm ${error || statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {error || statusMsg.text}
                        </div>
                    )}

                    {/* --- LOGIN FORM --- */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Welcome Back!</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="text-right">
                                <Link to="/forgot-password" class="text-sm text-[#00b4d8] hover:underline">Forgot password?</Link>
                            </div>
                            <button type="submit" className="w-full py-2.5 px-4 bg-[#00b4d8] text-white font-bold rounded-md hover:bg-[#0096c7] transition duration-200" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {/* --- SIGNUP FORM --- */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Create Account</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={signupData.fullName}
                                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]"
                                        value={signupData.industry}
                                        onChange={(e) => setSignupData({...signupData, industry: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>Select...</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Education">Education</option>
                                        <option value="Student">Student</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                        value={signupData.profession}
                                        onChange={(e) => setSignupData({...signupData, profession: e.target.value})}
                                        required 
                                    />
                                </div>
                            </div>
                             {signupData.industry === 'Other' && (
                                <div>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                        placeholder="Specify Industry"
                                        value={signupData.otherIndustry}
                                        onChange={(e) => setSignupData({...signupData, otherIndustry: e.target.value})}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-[#00b4d8] focus:border-[#00b4d8]"
                                        value={signupData.countryCode}
                                        onChange={(e) => setSignupData({...signupData, countryCode: e.target.value})}
                                    >
                                        <option value="+1">+1 (US)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+254">+254 (KE)</option>
                                        <option value="+234">+234 (NG)</option>
                                        <option value="+91">+91 (IN)</option>
                                    </select>
                                    <input 
                                        type="tel" 
                                        className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                        value={signupData.phone}
                                        onChange={(e) => setSignupData({...signupData, phone: e.target.value.replace(/\D/g,'')})}
                                        placeholder="712345678"
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                    required 
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00b4d8] focus:border-[#00b4d8]" 
                                    value={signupData.confirmPassword}
                                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                    required 
                                />
                            </div>

                            <button type="submit" className="w-full py-2.5 px-4 bg-[#00b4d8] text-white font-bold rounded-md hover:bg-[#0096c7] transition duration-200" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AuthPage;
