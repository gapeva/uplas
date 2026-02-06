import React from 'react';
import { useUplas } from '../contexts/UplasContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useUplas();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer__container">
        <div className="footer__column">
            <h4 className="footer__heading">{t('footer_about_us', 'About Us')}</h4>
            <p>{t('site_description')}</p>
        </div>
        
        <div className="footer__column">
            <h4 className="footer__heading">{t('footer_explore_uplas', 'Explore Uplas')}</h4>
            <ul className="footer__links">
                <li><Link to="/courses">{t('nav_courses', 'Courses')}</Link></li>
                <li><Link to="/pricing">{t('nav_pricing', 'Pricing')}</Link></li>
                <li><Link to="/blog">{t('nav_blog', 'Blog')}</Link></li>
                <li><Link to="/community">{t('nav_community', 'Community')}</Link></li>
            </ul>
        </div>

        <div className="footer__column">
             <h4 className="footer__heading">{t('footer_legal_support', 'Legal & Support')}</h4>
             <ul className="footer__links">
                <li><Link to="/terms">{t('footer_terms', 'Terms of Service')}</Link></li>
                <li><Link to="/privacy">{t('footer_privacy', 'Privacy Policy')}</Link></li>
                <li><Link to="/help">{t('footer_help', 'Help Center')}</Link></li>
            </ul>
        </div>

        <div className="footer__column">
            <h4 className="footer__heading">{t('footer_follow_us', 'Connect With Us')}</h4>
            <div className="footer__socials">
                {/* Social icons would go here, preserving HTML structure */}
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
            <p>{t('footer_location', 'Nairobi, Kenya')}</p>
        </div>
      </div>
      
      <div className="container footer__bottom">
        <p id="current-year-footer">
            {t('footer_copyright_dynamic').replace('{currentYear}', currentYear)}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
