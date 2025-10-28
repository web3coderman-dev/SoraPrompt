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
        {/* Main Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              {t['footer.company'] || 'SoraPrompt Studio'}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[280px]">
              {t['footer.slogan'] || '让你的创意，变成 Sora 短视频爆款'}
            </p>
          </div>

          {/* Legal Links Column */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              {t['footer.legal'] || 'Legal'}
            </h3>
            <ul className="space-y-2">
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

          {/* Product Links Column */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              {t['footer.product'] || 'Product'}
            </h3>
            <ul className="space-y-2">
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
        </div>

        {/* Bottom Bar - Copyright + Social Icons */}
        <div className="mt-12 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-text-tertiary">
              © {currentYear} {t['footer.copyright'] || 'SoraPrompt Studio. All rights reserved.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-keyLight transition-all duration-300 ease-smooth group"
                  aria-label={link.ariaLabel}
                >
                  <link.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
