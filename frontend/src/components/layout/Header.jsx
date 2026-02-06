// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import '../../styles/header.css'; 

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle Mobile Menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="site-header">
            <div className="container header__container">
                <Link to="/" className="logo" aria-label="Uplas Homepage">
                    {/* FIX: Corrected filename to match uploaded assets */}
                    <img src="/images/uni_plas_prev_ui.ico.png" alt="Uplas Logo" className="logo__img" />
                    <span className="logo__text">plas</span>
                </Link>

                <nav 
                    className={`nav ${isMenuOpen ? 'nav--open' : ''}`} 
                    id="main-navigation" 
                    aria-label="Main site navigation"
                >
                    {/* Logged Out Navigation */}
                    {!user && (
                        <ul className="nav__list" id="nav-logged-out">
                            <li className="nav__item"><Link to="/" className="nav__link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                            <li className="nav__item"><Link to="/courses" className="nav__link" onClick={() => setIsMenuOpen(false)}>Courses</Link></li>
                            <li className="nav__item"><Link to="/pricing" className="nav__link" onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
                            <li className="nav__item"><Link to="/about" className="nav__link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                            <li className="nav__item"><Link to="/blog" className="nav__link" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                        </ul>
                    )}

                    {/* Logged In Navigation */}
                    {user && (
                        <ul className="nav__list" id="nav-logged-in">
                            <li className="nav__item"><Link to="/dashboard" className="nav__link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                            <li className="nav__item"><Link to="/courses" className="nav__link" onClick={() => setIsMenuOpen(false)}>My Courses</Link></li>
                            <li className="nav__item"><Link to="/community" className="nav__link" onClick={() => setIsMenuOpen(false)}>Community</Link></li>
                        </ul>
                    )}
                </nav>

                <div className="header-actions">
                    <div className="language-currency-selectors">
                         {/* ... (Keep existing selectors code) ... */}
                        <div className="select-wrapper">
                            <label htmlFor="language-selector" className="sr-only">Select Language</label>
                            <i className="fas fa-globe selector-icon"></i>
                            <select id="language-selector" className="header-select" title="Select Language" defaultValue="en">
                                <option value="en">English (EN)</option>
                                <option value="es">Español (ES)</option>
                                <option value="fr">Français (FR)</option>
                                <option value="de">Deutsch (DE)</option>
                                <option value="zh">中文 (简体)</option>
                                <option value="hi">हिन्दी (HI)</option>
                            </select>
                        </div>
                         {/* ... (Keep existing currency code) ... */}
                    </div>

                    <button id="theme-toggle" className="button button--theme" aria-label="Switch color theme" title="Toggle theme">
                        <i className="fas fa-moon theme-icon theme-icon--dark"></i>
                        <i className="fas fa-sun theme-icon theme-icon--light"></i>
                        <span className="sr-only">Toggle Dark/Light Mode</span>
                    </button>

                    <div className="nav__item nav__item--cta-placeholder" id="auth-header-link-container">
                        {user ? (
                            <button 
                                onClick={handleLogout} 
                                className="button button--secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="button button--primary">Login / Sign Up</Link>
                        )}
                    </div>
                </div>

                <button 
                    className="nav__toggle" 
                    id="mobile-nav-toggle" 
                    aria-label="Toggle navigation menu" 
                    aria-expanded={isMenuOpen} 
                    aria-controls="main-navigation"
                    onClick={toggleMenu}
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
                    <span className="sr-only">Menu</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
