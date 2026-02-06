import React from 'react';
import { FileText, Mail } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-blue-900 px-6 py-8 text-white text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                        <FileText /> Terms of Service
                    </h1>
                    <p className="mt-2 text-blue-100 opacity-80">Last Updated: May 21, 2025</p>
                </div>
                
                <div className="p-8 space-y-6 text-gray-700 leading-relaxed">
                    <section>
                        <p>
                            Welcome to Uplas! These Terms of Service ("Terms") govern your access to and use of the Uplas website, including any content, functionality, and services offered on or through uplas.com (the "Site"). By using the Services, you accept and agree to be bound and abide by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">1. Acceptance of the Terms</h2>
                        <p>
                            The Services are offered and available to users who are 13 years of age or older. If you are under 18, you may only use the Services with the involvement of a parent or legal guardian who agrees to be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">2. Intellectual Property Rights</h2>
                        <p>
                            The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by Uplas, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">3. Prohibited Uses</h2>
                        <p>You agree not to use the Services:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
                            <li>To impersonate or attempt to impersonate Uplas, an Uplas employee, another user, or any other person or entity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-3">4. Governing Law</h2>
                        <p>
                            All matters relating to the Services and these Terms shall be governed by and construed in accordance with the internal laws of the Republic of Kenya without giving effect to any choice or conflict of law provision or rule.
                        </p>
                    </section>

                    <div className="bg-gray-100 p-6 rounded-lg mt-8">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Mail size={18}/> Contact Information
                        </h3>
                        <p className="text-sm">
                            To ask questions or comment about these Terms of Service, contact us at: 
                            <a href="mailto:legal@uplas.com" className="text-blue-600 font-bold ml-1 hover:underline">legal@uplas.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
