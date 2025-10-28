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
      icon: Twitter
    },
    {
      label: 'Discord',
      url: 'https://discord.gg/soraprompt',
      icon: MessageCircle
    },
    {
      label: 'GitHub',
      url: 'https://github.com/soraprompt',
      icon: Github
    },
  ];

  const handleInternalLink = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="border-t border-borderSubtle bg-sceneFill mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              {t['footer.company'] || 'SoraPrompt Studio'}
            </h3>
            <p className="text-xs text-text-tertiary">
              {t['footer.tagline'] || 'Professional AI-powered video prompt generator for Sora and other AI video tools.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              {t['footer.legal'] || 'Legal'}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleInternalLink(link.path)}
                    className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
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
                      className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleInternalLink(link.path)}
                      className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              {t['footer.community'] || 'Community'}
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-keyLight transition-colors duration-300 flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-borderSubtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-tertiary">
              © {currentYear} {t['footer.copyright'] || 'SoraPrompt Studio. All rights reserved.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  handleInternalLink('/terms');
                }}
                className="text-text-tertiary hover:text-keyLight transition-colors duration-300"
              >
                {t['footer.terms'] || 'Terms of Service'}
              </a>
              <span className="text-borderSubtle">•</span>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleInternalLink('/privacy');
                }}
                className="text-text-tertiary hover:text-keyLight transition-colors duration-300"
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
