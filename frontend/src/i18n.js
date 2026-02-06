import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation
      nav_home: 'Home',
      nav_courses: 'Courses',
      nav_pricing: 'Pricing',
      nav_blog: 'Blog',
      nav_community: 'Community',
      nav_projects: 'Projects',
      nav_login: 'Login',
      nav_signup: 'Sign Up',
      nav_logout: 'Logout',
      nav_profile: 'Profile',

      // Hero Section
      hero_title: 'The AI Revolution is Here. Are You Ready?',
      hero_subtitle: 'Uplas empowers Professionals and Students to Upskill or Reskill with Personalized AI Learning. Master AI with our unique Q&A model and secure your place in the future workforce.',
      get_started_free: 'Get Started Free',
      explore_plans: 'Explore Plans',

      // Benefits Section
      benefits_title: 'Why Uplas is Your Key to AI Mastery',
      benefits_subtitle: 'Unlock unparalleled advantages and accelerate your AI journey with our cutting-edge platform.',
      benefit1_title: 'Hyper-Personalized Learning Paths',
      benefit1_desc: 'Our AI tailors questions and content to your unique skill level and learning pace, ensuring you grasp concepts effectively and efficiently.',
      benefit2_title: '24/7 AI Tutor Support',
      benefit2_desc: 'Never get stuck. Our intelligent AI Tutor provides instant answers, explanations, and guidance whenever you need it, day or night.',
      benefit3_title: 'Portfolio-Ready AI Projects',
      benefit3_desc: 'Move beyond theory. Apply your skills by building AI-generated, real-world projects that showcase your capabilities to potential employers.',
      benefit4_title: 'Flexible Learning Formats',
      benefit4_desc: 'Learn your way. Instantly convert answers and explanations into audio summaries or video walkthroughs with our integrated TTS and TTV technology.',
      benefit5_title: 'Thriving Global Community',
      benefit5_desc: 'Connect with fellow learners, mentors, and industry experts. Share insights, collaborate on projects, and network for future opportunities.',
      benefit6_title: 'Future-Proof Your Career',
      benefit6_desc: 'Equip yourself with the most in-demand AI skills. Upskill for your current role or reskill for the AI-driven job market of tomorrow.',

      // Auth Section
      signup_tab: 'Sign Up',
      login_tab: 'Login',
      signup_title: 'Create Your Uplas Account',
      login_title: 'Welcome Back to Uplas!',
      label_fullname: 'Full Name',
      label_email: 'Email Address',
      label_password: 'Password',
      label_confirm_password: 'Confirm Password',
      label_organization: 'Organization/College/School',
      label_industry: 'Primary Industry/Field of Study',
      label_profession: 'Current or Target Profession',
      label_phone: 'Phone Number',
      placeholder_fullname: 'e.g., Jane Doe',
      placeholder_email: 'you@example.com',
      placeholder_password: 'Choose a strong password',
      placeholder_confirm_password: 'Re-enter your password',
      placeholder_organization: 'e.g., Acme Corp, Tech University',
      placeholder_profession: 'e.g., AI Specialist, Data Analyst',
      btn_next: 'Next',
      btn_previous: 'Previous',
      btn_create_account: 'Create Account',
      btn_login: 'Login',
      forgot_password: 'Forgot password?',
      terms_agree: 'I agree to the Uplas',
      terms_link: 'Terms of Service',
      and: 'and',
      privacy_link: 'Privacy Policy',
      password_hint: 'Min. 8 characters, with uppercase, lowercase, number, and special symbol.',

      // FAQ Section
      faq_title: 'Frequently Asked Questions',
      faq_subtitle: 'Have questions? We\'ve got answers.',
      faq1_q: 'Will AI take my job?',
      faq1_a: 'It\'s a valid concern! While AI automates some tasks, it primarily changes jobs, creating new roles and demanding new skills. The key isn\'t fearing replacement, but learning to collaborate with AI.',
      faq2_q: 'Why do I need to learn AI?',
      faq2_a: 'AI is becoming fundamental across industries. Understanding AI helps you leverage powerful tools to boost productivity, gain deeper insights from data, and make better decisions.',
      faq3_q: 'What makes Uplas different?',
      faq3_a: 'Personalized Q&A Model, AI Tutor Support, AI-Generated Real-World Projects, Text-to-Audio/Video conversion, and a Vibrant Community.',
      faq4_q: 'Do I need tech experience to start?',
      faq4_a: 'No! Uplas is designed for everyone, from absolute beginners to those looking to advance their skills.',

      // Footer
      footer_contact: 'Get in Touch',
      footer_location: 'Uplas Towers, Kilifi, Kenya',
      footer_follow: 'Connect With Us',
      footer_explore: 'Explore Uplas',
      footer_legal: 'Legal & Support',
      footer_terms: 'Terms of Service',
      footer_privacy: 'Privacy Policy',
      footer_copyright: '© {year} Uplas EdTech Solutions Ltd. All rights reserved.',

      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      clear: 'Clear',
      submit: 'Submit',
      
      // Theme
      toggle_theme_dark: 'Switch to Dark Mode',
      toggle_theme_light: 'Switch to Light Mode',
    }
  },
  es: {
    translation: {
      nav_home: 'Inicio',
      nav_courses: 'Cursos',
      nav_pricing: 'Precios',
      nav_blog: 'Blog',
      nav_community: 'Comunidad',
      nav_projects: 'Proyectos',
      nav_login: 'Acceder',
      nav_signup: 'Registrarse',
      hero_title: 'La Revolución de la IA está Aquí. ¿Estás Listo?',
      hero_subtitle: 'Uplas capacita a Profesionales y Estudiantes para Mejorar o Reorientar sus habilidades con Aprendizaje de IA Personalizado.',
      get_started_free: 'Comienza Gratis',
      explore_plans: 'Explorar Planes',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
