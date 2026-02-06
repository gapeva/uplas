import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUplas } from '../contexts/UplasContext';
// Import legacy CSS
import '../assets/css/header.css'; 

const Header = () => {
  const { user, t, theme, toggleTheme, language, setLanguage, currency, setCurrency } = useUplas();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
    document.body.classList.toggle('mobile-nav-active', !mobileNavOpen);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="container header__container">
      <Link to="/" className="logo" aria-label="Uplas Homepage">
        <img src="/images/logo-u.svg.png" alt="Uplas Logo" className="logo__img" />
        <span className="logo__text">plas</span>
      </Link>

      <nav 
        className={`nav ${mobileNavOpen ? 'nav--active' : ''}`} 
        id="main-navigation" 
        aria-label="Main site navigation"
      >
        {!user ? (
          <ul className="nav__list" id="nav-logged-out">
            <li className="nav__item"><Link to="/" className="nav__link">{t('nav_home', 'Home')}</Link></li>
            <li className="nav__item"><Link to="/courses" className="nav__link">{t('nav_courses', 'Courses')}</Link></li>
            <li className="nav__item"><Link to="/pricing" className="nav__link">{t('nav_pricing', 'Pricing')}</Link></li>
            <li className="nav__item"><Link to="/about" className="nav__link">{t('nav_about_us', 'About')}</Link></li>
            <li className="nav__item"><Link to="/blog" className="nav__link">{t('nav_blog', 'Blog')}</Link></li>
          </ul>
        ) : (
          <ul className="nav__list" id="nav-logged-in">
             <li className="nav__item"><Link to="/dashboard" className="nav__link">{t('nav_dashboard', 'Dashboard')}</Link></li>
             <li className="nav__item"><Link to="/my-courses" className="nav__link">{t('nav_my_courses', 'My Courses')}</Link></li>
             <li className="nav__item"><Link to="/community" className="nav__link">{t('nav_community', 'Community')}</Link></li>
          </ul>
        )}
      </nav>

      <div className="header-actions">
        <div className="language-currency-selectors">
          <div className="select-wrapper">
            <label htmlFor="language-selector" className="sr-only">{t('sr_select_language', 'Select Language')}</label>
            <i className="fas fa-globe selector-icon"></i>
            <select 
              id="language-selector" 
              className="header-select" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              {/* Add other options from legacy code */}
            </select>
          </div>
          <div className="select-wrapper" id="currency-selector-wrapper">
            <label htmlFor="currency-selector" className="sr-only">{t('sr_select_currency', 'Select Currency')}</label>
            <i className="fas fa-coins selector-icon"></i>
            <select 
              id="currency-selector" 
              className="header-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="KES">KES (KSh)</option>
              {/* Add other options */}
            </select>
          </div>
        </div>

        <button 
          id="theme-toggle" 
          className="button button--theme" 
          onClick={toggleTheme}
          aria-label={t('toggle_theme_sr', 'Toggle Dark/Light Mode')}
        >
          <i className="fas fa-moon theme-icon theme-icon--dark" style={{ display: theme === 'dark' ? 'none' : 'inline-block' }}></i>
          <i className="fas fa-sun theme-icon theme-icon--light" style={{ display: theme === 'dark' ? 'inline-block' : 'none' }}></i>
        </button>

        {user ? (
          <div className="user-profile-container" style={{display: 'flex'}}>
             <div className="user-avatar-header">
                <div className="user-avatar-button-header">{getUserInitials(user.full_name)}</div>
             </div>
          </div>
        ) : (
          <div className="nav__item nav__item--cta-placeholder" id="auth-header-link-container">
            <a href="#auth-section" className="button button--primary">{t('nav_login_signup', 'Login / Sign Up')}</a>
          </div>
        )}
      </div>

      <button 
        className={`nav__toggle ${mobileNavOpen ? 'active' : ''}`} 
        id="mobile-nav-toggle" 
        onClick={toggleMobileNav}
        aria-label="Toggle navigation menu"
      >
        <i className={`fas ${mobileNavOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default Header;
