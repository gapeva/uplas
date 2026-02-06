import React from 'react';
import { Lock, Shield, Mail } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-green-800 px-6 py-8 text-white text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                        <Shield /> Privacy Policy
                    </h1>
                    <p className="mt-2 text-green-100 opacity-80">Last Updated: May 21, 2025</p>
                </div>
                
                <div className="p-8 space-y-6 text-gray-700 leading-relaxed">
                    <section>
                        <p>
                            Uplas EdTech Solutions Ltd. ("Uplas", "we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website, uplas.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Data:</strong> Name, email address, phone number, and payment information (processed by third-party processors).</li>
                            <li><strong>Derivative Data:</strong> IP address, browser type, operating system, and access times.</li>
                            <li><strong>Course Data:</strong> Progress in courses, answers to questions, and interactions with the AI Tutor.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">2. How We Use Your Information</h2>
                        <p>We use information collected about you to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Create and manage your account.</li>
                            <li>Personalize your learning experience and AI interactions.</li>
                            <li>Process transactions and send related emails.</li>
                            <li>Improve the functionality of the Services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">3. Data Security</h2>
                        <p className="flex items-start gap-3">
                            <Lock className="text-green-600 mt-1 shrink-0" size={20}/>
                            <span>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                            </span>
                        </p>
                    </section>

                    <div className="bg-gray-100 p-6 rounded-lg mt-8">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Mail size={18}/> Contact Us
                        </h3>
                        <p className="text-sm">
                            If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at: 
                            <a href="mailto:privacy@uplas.com" className="text-green-700 font-bold ml-1 hover:underline">privacy@uplas.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
