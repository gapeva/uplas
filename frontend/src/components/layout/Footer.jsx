import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-gray-900 text-white">
            <div className="footer__container container">
                
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
                        <a href="#" className="social-media__link" aria-label="Uplas on Facebook" title="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on Twitter" title="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on LinkedIn" title="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
                        <a href="#" className="social-media__link" aria-label="Uplas on Instagram" title="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
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
                        <li><Link to="/cookies" className="footer__link">Cookie Policy</Link></li>
                        <li><Link to="/pricing#contact-section" className="footer__link">Help Center</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer__bottom">
                <p className="footer__copyright">
                    © <span id="current-year-footer">{new Date().getFullYear()}</span> Uplas EdTech Solutions Ltd. All rights reserved. Empowering the next generation of AI innovators.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
