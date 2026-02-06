import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Assuming Django sends ?token=...
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert("Passwords don't match");
        
        setStatus('loading');
        try {
            await api.post('/auth/password/reset/confirm/', { token, password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border">
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
                
                {status === 'success' ? (
                    <div className="text-green-600 text-center bg-green-50 p-4 rounded">
                        Password reset successfully! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full border rounded-lg px-4 py-2"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full border rounded-lg px-4 py-2"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {status === 'error' && <p className="text-red-500 text-sm">Reset failed. Token may be invalid or expired.</p>}
                        
                        <button type="submit" disabled={status === 'loading'} className="w-full bg-black text-white py-3 rounded-lg font-bold">
                            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
