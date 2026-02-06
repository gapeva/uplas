import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Twitter, Linkedin, Github, Youtube } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const exploreLinks = [
    { to: '/courses', label: t('nav_courses') },
    { to: '/pricing', label: t('nav_pricing') },
    { to: '/blog', label: t('nav_blog') },
    { to: '/community', label: t('nav_community') },
    { to: '/projects', label: t('nav_projects') },
  ]

  const legalLinks = [
    { to: '/terms', label: t('footer_terms') },
    { to: '/privacy', label: t('footer_privacy') },
    { to: '/about', label: 'About Us' },
  ]

  const socialLinks = [
    { href: 'https://twitter.com/uplasai', icon: Twitter, label: 'Twitter' },
    { href: 'https://linkedin.com/company/uplas', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://github.com/uplas', icon: Github, label: 'GitHub' },
    { href: 'https://youtube.com/@uplas', icon: Youtube, label: 'YouTube' },
  ]

  return (
    <footer className="bg-light-text dark:bg-dark-bg text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div>
            <Link to="/" className="text-2xl font-bold text-gradient mb-4 inline-block">
              Uplas
            </Link>
            <p className="text-gray-400 mb-4 text-sm">
              Empowering the next generation of AI innovators through personalized learning.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@uplas.me" className="hover:text-secondary">hello@uplas.me</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{t('footer_location')}</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_explore')}</h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-secondary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_legal')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-secondary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_follow')}</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark-panel flex items-center justify-center hover:bg-secondary hover:text-black transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-gray-500">
          <p>{t('footer_copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}
