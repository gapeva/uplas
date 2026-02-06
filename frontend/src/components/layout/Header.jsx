import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import '../../styles/header.css'; // Import header-specific styles

const Header = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('uplasGlobalTheme') === 'true');

    // Theme Toggle Logic
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('uplasGlobalTheme', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header__container">
                <Link to="/" className="logo">
                    <img src="/images/logo-u.svg.png" alt="Uplas Logo" className="logo__img" />
                    <span className="logo__text">plas</span>
                </Link>

                <nav className={`nav ${isMobileNavOpen ? 'nav--active' : ''}`} id="main-navigation">
                    {isAuthenticated ? (
                        <ul className="nav__list">
                             <li className="nav__item"><Link to="/dashboard" className="nav__link">Dashboard</Link></li>
                             <li className="nav__item"><Link to="/my-courses" className="nav__link">My Courses</Link></li>
                             <li className="nav__item"><Link to="/community" className="nav__link">Community</Link></li>
                             <li className="nav__item"><button onClick={handleLogout} className="nav__link">Logout</button></li>
                        </ul>
                    ) : (
                        <ul className="nav__list">
                            <li className="nav__item"><Link to="/" className="nav__link">Home</Link></li>
                            <li className="nav__item"><Link to="/courses" className="nav__link">Courses</Link></li>
                            <li className="nav__item"><Link to="/pricing" className="nav__link">Pricing</Link></li>
                            <li className="nav__item"><Link to="/about" className="nav__link">About</Link></li>
                        </ul>
                    )}
                </nav>

                <div className="header-actions">
                    <button onClick={toggleTheme} className="button button--theme">
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} theme-icon`}></i>
                    </button>

                    {!isAuthenticated && (
                         <div className="nav__item">
                            <Link to="/login" className="button button--primary">Login / Sign Up</Link>
                        </div>
                    )}
                    
                    {isAuthenticated && user && (
                        <div className="user-avatar-header">
                            {/* Display user initials or avatar */}
                            <span className="user-initials">{user.full_name?.charAt(0) || 'U'}</span>
                        </div>
                    )}
                </div>

                <button 
                    className="nav__toggle" 
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                >
                    <i className={`fas ${isMobileNavOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
