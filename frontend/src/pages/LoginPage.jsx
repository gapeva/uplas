import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <section className="auth-section">
            <div className="container auth-section__container">
                <div className="form-wrapper">
                    <form onSubmit={handleSubmit} className="form form--active">
                        <h3 className="form__title">Welcome Back to Uplas!</h3>
                        {error && <div className="form__status form__status--error">{error}</div>}
                        
                        <div className="form__group">
                            <label className="form__label">Email Address</label>
                            <input 
                                type="email" 
                                className="form__input" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label">Password</label>
                            <input 
                                type="password" 
                                className="form__input" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="button button--primary form__button" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
