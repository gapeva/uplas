import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Brain, MessageCircle, Briefcase, Headphones, Users, Award, ChevronDown } from 'lucide-react'
import AuthSection from '../components/AuthSection'

export default function HomePage() {
  const { t } = useTranslation()

  const benefits = [
    { icon: Brain, title: 'Hyper-Personalized Learning Paths', description: 'Our AI tailors questions and content to your unique skill level and learning pace, ensuring you grasp concepts effectively and efficiently.' },
    { icon: MessageCircle, title: '24/7 AI Tutor Support', description: 'Never get stuck. Our intelligent AI Tutor provides instant answers, explanations, and guidance whenever you need it, day or night.' },
    { icon: Briefcase, title: 'Portfolio-Ready AI Projects', description: 'Move beyond theory. Apply your skills by building AI-generated, real-world projects that showcase your capabilities to potential employers.' },
    { icon: Headphones, title: 'Flexible Learning Formats', description: 'Learn your way. Instantly convert answers and explanations into audio summaries or video walkthroughs with our integrated TTS and TTV technology.' },
    { icon: Users, title: 'Thriving Global Community', description: 'Connect with fellow learners, mentors, and industry experts. Share insights, collaborate on projects, and network for future opportunities.' },
    { icon: Award, title: 'Future-Proof Your Career', description: 'Equip yourself with the most in-demand AI skills. Upskill for your current role or reskill for the AI-driven job market of tomorrow.' },
  ]

  const faqs = [
    { question: 'Will AI take my job?', answer: "It's a valid concern! While AI automates some tasks, it primarily changes jobs, creating new roles and demanding new skills. Uplas helps you stay ahead by equipping you with AI skills that make you indispensable in the evolving job market." },
    { question: 'Do I need prior coding experience?', answer: 'Not necessarily! Our courses cater to various skill levels. We have beginner-friendly modules that introduce foundational concepts, as well as advanced tracks for experienced developers looking to specialize in AI.' },
    { question: 'How does personalized learning work?', answer: 'Our AI analyzes your responses, learning pace, and areas of interest. It then curates a unique learning path, adapts question difficulty, and suggests relevant resources, ensuring optimal knowledge retention.' },
    { question: 'What are the Text-to-Speech (TTS) and Text-to-Video (TTV) features?', answer: 'These features convert text-based answers and explanations into audio and video formats. This provides flexible learning options – listen to summaries on the go or watch visual explanations for complex topics.' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ 
        padding: 'var(--spacing-xxxl) 0',
        background: 'linear-gradient(135deg, var(--color-primary-ultralight) 0%, transparent 50%)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xxl)', alignItems: 'center' }}>
            <div>
              <h1 className="hero-section__title" style={{ 
                fontSize: 'var(--font-size-hero)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-heading)',
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--current-text-color)'
              }}>
                The AI Revolution is Here. <span style={{ color: 'var(--color-primary)' }}>Are You Ready?</span>
              </h1>
              <p style={{ 
                fontSize: 'var(--font-size-lg)',
                color: 'var(--current-text-color-secondary)',
                marginBottom: 'var(--spacing-xl)',
                lineHeight: '1.7'
              }}>
                Uplas empowers Professionals and Students to Upskill or Reskill with Personalized AI Learning.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <a href="#auth-section" className="button button--primary button--large">
                  Get Started Free
                </a>
                <a href="/pricing" className="button button--secondary button--large">
                  Explore Plans
                </a>
              </div>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              borderRadius: 'var(--border-radius-xl)',
              padding: 'var(--spacing-xxl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '350px',
              boxShadow: 'var(--box-shadow-lg)'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <Brain size={80} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.9 }} />
                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>
                  AI-Powered Learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ 
        padding: 'var(--spacing-xxxl) 0',
        backgroundColor: 'var(--current-card-bg)'
      }}>
        <div className="container">
          <h2 className="section-title">Why Uplas is Your Key to AI Mastery</h2>
          <p className="section-subtitle">
            Unlock unparalleled advantages and accelerate your AI journey with our cutting-edge platform.
          </p>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="card" style={{ padding: 'var(--spacing-xl)' }}>
                <div style={{ 
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--border-radius-lg)',
                  backgroundColor: 'var(--color-primary-ultralight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <benefit.icon size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--current-text-color)'
                }}>{benefit.title}</h3>
                <p style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--current-text-color-secondary)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section style={{ padding: 'var(--spacing-xxxl) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xxl)', alignItems: 'center' }}>
            <div>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--current-text-color)'
              }}>
                Dive Deep into Practical AI Applications
              </h2>
              <p style={{ 
                color: 'var(--current-text-color-secondary)',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: '1.7'
              }}>
                Our courses are meticulously designed to bridge the gap between theoretical knowledge 
                and practical, real-world application. Each module is crafted to build upon the last, 
                ensuring a comprehensive understanding.
              </p>
              <a href="/courses" className="button button--primary">
                Explore Our Courses
              </a>
            </div>
            <div style={{ 
              backgroundColor: 'var(--color-secondary)',
              opacity: 0.1,
              borderRadius: 'var(--border-radius-xl)',
              aspectRatio: '1',
              maxWidth: '400px',
              margin: '0 auto'
            }} />
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <AuthSection />

      {/* FAQ Section */}
      <section style={{ 
        padding: 'var(--spacing-xxxl) 0',
        backgroundColor: 'var(--current-card-bg)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Have questions? We've got answers. If you don't see yours here, feel free to contact our team.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          textAlign: 'left',
          fontWeight: 'var(--font-weight-medium)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--current-text-color)',
          transition: 'background-color var(--transition-base)'
        }}
      >
        <span>{question}</span>
        <ChevronDown size={20} style={{ 
          transition: 'transform var(--transition-base)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </button>
      {isOpen && (
        <div style={{
          padding: '0 var(--spacing-lg) var(--spacing-lg)',
          color: 'var(--current-text-color-secondary)',
          lineHeight: '1.7'
        }}>
          {answer}
        </div>
      )}
    </div>
  )
}
