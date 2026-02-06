import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

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
        } else {
             // Error is handled by store, but we can display specific field errors if needed
        }
    };

    return (
        <section className="auth-section py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-md">
                
                {/* Tabs */}
                <div className="flex mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                    <button 
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    
                    {/* Global Error/Status Display */}
                    {(error || statusMsg.text) && (
                        <div className={`mb-4 p-3 rounded ${error || statusMsg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {error || statusMsg.text}
                        </div>
                    )}

                    {/* --- LOGIN FORM --- */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4">Welcome Back to Uplas!</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    required 
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    required 
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="text-right">
                                <Link to="/forgot-password" class="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                            </div>
                            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {/* --- SIGNUP FORM --- */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4">Create Your Uplas Account</h3>
                            
                            {/* Step 1: Basic Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                                    value={signupData.fullName}
                                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                                    required 
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                    required 
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Step 2: Professional */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                                        value={signupData.profession}
                                        onChange={(e) => setSignupData({...signupData, profession: e.target.value})}
                                        required 
                                        placeholder="e.g. Data Analyst"
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

                            {/* Step 3: Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md" 
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                                    value={signupData.confirmPassword}
                                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                    required 
                                />
                            </div>

                            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200" disabled={isLoading}>
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
