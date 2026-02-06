
// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-gray-900 text-white">
            <div className="footer__container container">
                
                {/* Branding Section (Added for Parity/Consistency) */}
                <div className="footer__section footer__section--brand">
                     <Link to="/" className="flex items-center gap-2 mb-4">
                        <img src="/images/uni_plas_prev_ui.ico.png" alt="Uplas" className="h-10 w-auto" />
                        <span className="text-2xl font-bold tracking-tight text-white">plas</span>
                    </Link>
                    <p className="text-gray-400 text-sm">
                        Empowering Professionals and Students to Upskill or Reskill with Personalized AI Learning.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="footer__section footer__section--contact">
                    <h3 className="footer__heading">Get in Touch</h3>
                    <address className="footer__address">
                        <p>
                            <i className="fas fa-phone footer__icon" aria-hidden="true"></i> 
                            <a href="tel:+254708654984" className="footer__link">+254 708 654 984</a>
                        </p>
                        <p>
                            <i className="fas fa-envelope footer__icon" aria-hidden="true"></i> 
                            <a href="mailto:john@uplas.guru" className="footer__link">john@uplas.guru</a>
                        </p>
                        <p>
                            <i className="fas fa-map-marker-alt footer__icon" aria-hidden="true"></i> 
                            <span>Nairobi, Kenya</span>
                        </p>
                    </address>
                </div>

                {/* Social Section */}
                <div className="footer__section footer__section--social">
                    <h3 className="footer__heading">Connect With Us</h3>
                    <div className="social-media">
                        <a href="#" className="social-media__link" aria-label="Uplas on Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on Instagram"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>

                {/* Explore Section */}
                <div className="footer__section footer__section--links">
                    <h3 className="footer__heading">Explore Uplas</h3>
                    <ul className="footer__list">
                        <li><Link to="/" className="footer__link">Home</Link></li>
                        <li><Link to="/courses" className="footer__link">All Courses</Link></li>
                        <li><Link to="/pricing" className="footer__link">Pricing Plans</Link></li>
                        <li><Link to="/blog" className="footer__link">AI Insights Blog</Link></li>
                        <li><Link to="/about" className="footer__link">About Uplas</Link></li>
                    </ul>
                </div>

                {/* Legal Section */}
                <div className="footer__section footer__section--legal">
                    <h3 className="footer__heading">Legal & Support</h3>
                    <ul className="footer__list">
                        <li><Link to="/terms" className="footer__link">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
                        <li><Link to="/pricing#contact-section" className="footer__link">Help Center</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer__bottom">
                <p className="footer__copyright">
                    © {new Date().getFullYear()} Uplas EdTech Solutions Ltd. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
