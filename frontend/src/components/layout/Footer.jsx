// FILE: frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <img src="/images/logo-u.svg.png" alt="Uplas" className="h-8" /> Uplas
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Master AI, Secure Your Future. Empowering professionals and students with personalized AI learning.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/courses" className="hover:text-white">Browse Courses</Link></li>
                        <li><Link to="/projects" className="hover:text-white">AI Projects</Link></li>
                        <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                        <li><Link to="/ai-tutor" className="hover:text-white">AI Tutor</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Uplas. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
