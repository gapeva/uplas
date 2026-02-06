import React from 'react';
import Header from '../components/Header';
import AuthSection from '../components/AuthSection';
import { useUplas } from '../contexts/UplasContext';

// Import CSS (ensure these files exist in src/assets/css)
import '../assets/css/variables.css';
import '../assets/css/global.css';
import '../assets/css/uhome.css';

const Home = () => {
  const { t } = useUplas();

  return (
    <>
      <Header />
      <main className="main-content">
        
        {/* HERO SECTION */}
        <section className="hero-section">
            <div className="container hero-section__container">
                <div className="hero-section__text-content">
                    <h1 className="hero-section__title">{t('hero_title', 'The AI Revolution is Here. Are You Ready?')}</h1>
                    <p className="hero-section__subtitle">{t('hero_subtitle', 'Uplas empowers Professionals and Students...')}</p>
                    <div className="hero-section__cta-group">
                        <a href="#auth-section" className="button button--primary button--large hero-section__cta">{t('get_started_free_cta', 'Get Started Free')}</a>
                        <a href="/pricing" className="button button--secondary button--large hero-section__cta">{t('explore_plans_cta', 'Explore Plans')}</a>
                    </div>
                </div>
                <div className="hero-section__media-content">
                    <div className="video-responsive-container">
                        <img src="/images/uplas_hero_placeholder.png" alt={t('hero_image_alt_attr')} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius: 'var(--border-radius-lg)'}} />
                         {/* iFrame omitted for brevity, logic same as HTML */}
                    </div>
                </div>
            </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="benefits-section">
            <div className="container">
                <h2 className="section-title">{t('benefits_title')}</h2>
                <p className="section-subtitle">{t('benefits_subtitle')}</p>
                <div className="benefits-grid">
                     <div className="benefit-item">
                        <div className="benefit-item__icon">🧠</div>
                        <h3 className="benefit-item__title">{t('benefit1_title')}</h3>
                        <p>{t('benefit1_desc')}</p>
                    </div>
                    {/* ... (Repeat for other benefits items matching index.html) ... */}
                    <div className="benefit-item">
                        <div className="benefit-item__icon">💡</div>
                        <h3 className="benefit-item__title">{t('benefit2_title')}</h3>
                        <p>{t('benefit2_desc')}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FEATURE HIGHLIGHT */}
        <section className="feature-highlight-section" id="course-description-image-section">
            <div className="container feature-highlight__container">
                <div className="feature-highlight__image-container">
                    <img src="/images/logo-u.svg.png" alt={t('course_desc_image_alt')} className="feature-highlight__image" />
                </div>
                <div className="feature-highlight__text-content">
                    <h2 className="section-title section-title--left-align">{t('course_desc_title')}</h2>
                    <p>{t('course_desc_text')}</p>
                    <a href="/courses" className="button button--primary">{t('explore_our_courses_cta')}</a>
                </div>
            </div>
        </section>

        {/* AUTH SECTION */}
        <AuthSection />

        {/* FAQ SECTION */}
        <section className="faq-section">
            <div className="container">
                <h2 className="section-title">{t('faq_title')}</h2>
                <div className="faq-accordion">
                    <details className="faq-item">
                        <summary className="faq-item__question">{t('faq1_question')}</summary>
                        <div className="faq-item__answer"><p>{t('faq1_answer')}</p></div>
                    </details>
                     {/* ... Repeat for other FAQs ... */}
                </div>
            </div>
        </section>
      </main>
      
      {/* Footer component would go here */}
      <footer id="site-footer-placeholder"></footer> 
    </>
  );
};

export default Home;
