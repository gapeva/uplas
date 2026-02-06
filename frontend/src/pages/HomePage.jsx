import { Link } from 'react-router-dom';
import '../../styles/uhome.css'; 

const HomePage = () => {
    return (
        <>
            <section className="hero-section">
                <div className="container hero-section__container">
                    <div className="hero-section__text-content">
                        <h1 className="hero-section__title">The AI Revolution is Here. Are You Ready?</h1>
                        <p className="hero-section__subtitle">
                            Uplas empowers Professionals and Students to Upskill or Reskill with Personalized AI Learning.
                        </p>
                        <div className="hero-section__cta-group">
                            <Link to="/signup" className="button button--primary button--large hero-section__cta">Get Started Free</Link>
                            <Link to="/pricing" className="button button--secondary button--large hero-section__cta">Explore Plans</Link>
                        </div>
                    </div>
                    {/* Media content ... */}
                </div>
            </section>
            
            {/* Benefits Section, Feature Highlight, etc. can be separate components */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">Why Uplas is Your Key to AI Mastery</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-item__icon">🧠</div>
                            <h3 className="benefit-item__title">Hyper-Personalized Learning</h3>
                            <p>Our AI tailors questions and content to your unique skill level.</p>
                        </div>
                        {/* Add other benefit items */}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
