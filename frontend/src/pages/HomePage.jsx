import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/uhome.css'; 
import heroImage from '../assets/images/uplas_hero_placeholder.png'; // Make sure this asset exists or use placeholder
import featureImage from '../assets/images/logo-u.svg.png'; // Make sure this asset exists

// Simple FAQ Item Component
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="faq-item border-b border-gray-200 py-4">
            <button 
                className="faq-item__question w-full text-left font-semibold flex justify-between items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {question}
                <span>{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && (
                <div className="faq-item__answer mt-2 text-gray-600">
                    {answer}
                </div>
            )}
        </div>
    );
};

const HomePage = () => {
    return (
        <>
            <section className="hero-section">
                <div className="container hero-section__container">
                    <div className="hero-section__text-content">
                        <h1 className="hero-section__title">The AI Revolution is Here. Are You Ready?</h1>
                        <p className="hero-section__subtitle">
                            Uplas empowers Professionals and Students to Upskill or Reskill with Personalized AI Learning. 
                            Master AI with our unique Q&A model and secure your place in the future workforce.
                        </p>
                        <div className="hero-section__cta-group">
                            {/* Pass state to activate signup tab */}
                            <Link to="/login" state={{ mode: 'signup' }} className="button button--primary button--large hero-section__cta">Get Started Free</Link>
                            <Link to="/pricing" className="button button--secondary button--large hero-section__cta">Explore Plans</Link>
                        </div>
                    </div>
                    <div className="hero-section__media-content">
                        <div className="video-responsive-container" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', background: '#eee' }}>
                            {/* Restored Iframe Logic */}
                            <iframe 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src="https://www.youtube-nocookie.com/embed/YOUR_YOUTUBE_VIDEO_ID"
                                title="Uplas Platform Quick Demo" 
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">Why Uplas is Your Key to AI Mastery</h2>
                    <p className="section-subtitle">Unlock unparalleled advantages and accelerate your AI journey.</p>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-item__icon">🧠</div>
                            <h3 className="benefit-item__title">Hyper-Personalized Learning</h3>
                            <p>Our AI tailors questions and content to your unique skill level.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-item__icon">💡</div>
                            <h3 className="benefit-item__title">24/7 AI Tutor Support</h3>
                            <p>Instant answers and guidance whenever you need it.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-item__icon">💼</div>
                            <h3 className="benefit-item__title">Portfolio-Ready Projects</h3>
                            <p>Build AI-generated, real-world projects for your CV.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-item__icon">🗣️</div>
                            <h3 className="benefit-item__title">Flexible Formats</h3>
                            <p>Text-to-Audio/Video to learn your way.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-item__icon">🌍</div>
                            <h3 className="benefit-item__title">Global Community</h3>
                            <p>Connect with fellow learners and mentors.</p>
                        </div>
                         <div className="benefit-item">
                            <div className="benefit-item__icon">🏆</div>
                            <h3 className="benefit-item__title">Future-Proof Your Career</h3>
                            <p>Equip yourself with the most in-demand AI skills.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="feature-highlight-section py-16 bg-gray-50">
                <div className="container feature-highlight__container flex flex-col md:flex-row items-center gap-10">
                    <div className="feature-highlight__image-container md:w-1/2">
                        {/* Replaced broken character with Image tag. Ensure the image is in public/images or imported */}
                        <div className="flex items-center justify-center">
                             <img src="/images/logo-u.svg.png" alt="Uplas Learning" className="max-w-full h-auto" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} />
                             <span className="text-4xl hidden">📱</span> {/* Fallback */}
                        </div>
                    </div>
                    <div className="feature-highlight__text-content md:w-1/2">
                        <h2 className="section-title text-left mb-4">Dive Deep into Practical AI Applications</h2>
                        <p className="mb-6 text-gray-700">
                            Our courses are meticulously designed to bridge the gap between theoretical knowledge 
                            and practical, real-world application. From understanding core concepts to deploying 
                            complex AI models, Uplas provides a hands-on experience.
                        </p>
                        <Link to="/courses" className="button button--primary">Explore Our Courses</Link>
                    </div>
                </div>
            </section>

            <section className="faq-section py-16">
                <div className="container max-w-3xl mx-auto">
                    <h2 className="section-title text-center mb-2">Frequently Asked Questions</h2>
                    <p className="section-subtitle text-center mb-10">Have questions? We've got answers.</p>
                    <div className="faq-accordion space-y-2">
                        <FaqItem 
                            question="Will AI take my job?" 
                            answer="It's a valid concern! While AI automates some tasks, it primarily changes jobs. The key is learning to collaborate with AI."
                        />
                        <FaqItem 
                            question="Why do I need to learn AI?" 
                            answer="AI is becoming fundamental across industries. Understanding it helps you leverage powerful tools to boost productivity."
                        />
                         <FaqItem 
                            question="What makes Uplas different?" 
                            answer="Personalized Q&A Model, AI Tutor Support, and AI-Generated Real-World Projects make us unique."
                        />
                         <FaqItem 
                            question="Do I need tech experience to start?" 
                            answer="No! Uplas is designed for everyone, from absolute beginners to those looking to advance their skills."
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
