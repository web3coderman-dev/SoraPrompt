import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Twitter, Github, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: t['footer.terms'] || 'Terms of Service', path: '/terms' },
    { label: t['footer.privacy'] || 'Privacy Policy', path: '/privacy' },
  ];

  const productLinks = [
    { label: t['footer.docs'] || 'Documentation', path: '/docs', external: true },
  ];

  const socialLinks = [
    {
      label: 'Twitter',
      url: 'https://twitter.com/SoraPrompt',
      icon: Twitter,
      ariaLabel: 'Follow us on Twitter'
    },
    {
      label: 'Discord',
      url: 'https://discord.gg/soraprompt',
      icon: MessageCircle,
      ariaLabel: 'Join our Discord community'
    },
    {
      label: 'GitHub',
      url: 'https://github.com/soraprompt',
      icon: Github,
      ariaLabel: 'Star us on GitHub'
    },
  ];

  const handleInternalLink = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="border-t border-border-subtle bg-scene-fill mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-text-primary mb-4">
              {t['footer.company'] || 'SoraPrompt Studio'}
            </h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              {t['footer.tagline'] || 'Professional AI-powered video prompt generator for Sora and other AI video tools.'}
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-4">
              {t['footer.legal'] || 'Legal'}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleInternalLink(link.path)}
                    className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300 ease-smooth text-left"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-4">
              {t['footer.product'] || 'Product'}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300 ease-smooth"
                      aria-label={`Open ${link.label} in new tab`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleInternalLink(link.path)}
                      className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300 ease-smooth text-left"
                      aria-label={`Navigate to ${link.label}`}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-4">
              {t['footer.community'] || 'Community'}
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300 ease-smooth flex items-center gap-2 group"
                    aria-label={link.ariaLabel}
                  >
                    <link.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-tertiary">
              © {currentYear} {t['footer.copyright'] || 'SoraPrompt Studio. All rights reserved.'}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-xs">
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  handleInternalLink('/terms');
                }}
                className="text-text-tertiary hover:text-keyLight transition-colors duration-300 ease-smooth"
                aria-label="Navigate to Terms of Service"
              >
                {t['footer.terms'] || 'Terms of Service'}
              </a>
              <span className="text-text-tertiary opacity-30">•</span>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleInternalLink('/privacy');
                }}
                className="text-text-tertiary hover:text-keyLight transition-colors duration-300 ease-smooth"
                aria-label="Navigate to Privacy Policy"
              >
                {t['footer.privacy'] || 'Privacy Policy'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
