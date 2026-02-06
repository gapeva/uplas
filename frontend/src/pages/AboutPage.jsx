import { Github, Linkedin, Twitter, Send } from 'lucide-react';
// Import images (Make sure these exist in your public/assets folder or update paths)
const mugambiImg = "/images/mugambi_john_ndeke.jpg.jpg";
const tsionImg = "/images/tsion_tamirat.jpg.jpg";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-24 text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        We Believe Talent is Universal, <br/> But Opportunity is Not.
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                        The age of AI is here, and it's reshaping our world. Uplas was born from a simple idea: 
                        to build the bridge between ambition and opportunity. We empower every professional and 
                        student with the skills to lead and innovate in an AI-driven future.
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Meet the Minds Behind the Mission</h2>
                    <p className="text-gray-600 mt-2">The passionate team driving the AI education revolution.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    
                    {/* Team Member 1: Mugambi */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row hover:-translate-y-2 transition duration-300">
                        <div className="md:w-2/5 h-64 md:h-auto bg-gray-200">
                            <img src={mugambiImg} alt="Mugambi (John) Ndeke" className="w-full h-full object-cover" />
                        </div>
                        <div className="md:w-3/5 p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900">Mugambi (John) Ndeke</h3>
                            <p className="text-blue-600 font-medium mb-4">Co-Founder & AI Lead</p>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                As the visionary behind Uplas, John combines deep technical expertise with a powerful drive. 
                                A full-stack AI Software Engineer building agentic systems with Python/Django and React. 
                                John builds with a strategic business perspective, ensuring Uplas is impactful.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://www.linkedin.com/in/mugambi-ndeke-43385823a/" className="text-gray-400 hover:text-blue-700 transition"><Linkedin size={20}/></a>
                                <a href="https://x.com/livingmugash" className="text-gray-400 hover:text-blue-400 transition"><Twitter size={20}/></a>
                                <a href="https://github.com/livingmugash" className="text-gray-400 hover:text-gray-900 transition"><Github size={20}/></a>
                            </div>
                        </div>
                    </div>

                    {/* Team Member 2: Tsion */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row hover:-translate-y-2 transition duration-300">
                        <div className="md:w-2/5 h-64 md:h-auto bg-gray-200">
                            <img src={tsionImg} alt="Tsion Tamirat" className="w-full h-full object-cover" />
                        </div>
                        <div className="md:w-3/5 p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900">Tsion Tamirat</h3>
                            <p className="text-blue-600 font-medium mb-4">Co-Founder & Software Engineer</p>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                Tsion is a versatile Software Engineer driven by creating user-focused applications. 
                                With expertise in C# (.NET), Python (Django), and React, she ensures our platform is robust 
                                and intuitive. A critical thinker committed to shaping Uplas's technical architecture.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-blue-700 transition"><Linkedin size={20}/></a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition"><Twitter size={20}/></a>
                                <a href="https://github.com/tsion1622" className="text-gray-400 hover:text-gray-900 transition"><Github size={20}/></a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
                    <p className="text-gray-600 mb-10">
                        Whether you're a potential partner, an investor, or just passionate about the future of education, we'd love to hear from you.
                    </p>
                    
                    <form className="bg-white p-8 rounded-2xl shadow-sm text-left space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows="4" className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </div>
            </section>

        </div>
    );
}
