import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Languages, Search, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const ALL_LANGUAGES: Language[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
];

type LanguageSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  detectedLanguage: string;
  disabled?: boolean;
};

export default function LanguageSelector({ value, onChange, detectedLanguage, disabled }: LanguageSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const updatePosition = useRef(() => {});

  updatePosition.current = () => {
    if (!isOpen || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownMaxHeight = 384;
    const dropdownMinHeight = 200;
    const dropdownWidth = 320;
    const spacing = 8;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom - spacing;
    const spaceAbove = rect.top - spacing;

    const shouldOpenUpward =
      spaceBelow < dropdownMinHeight &&
      spaceAbove > dropdownMinHeight &&
      spaceAbove > spaceBelow;

    const spaceRight = viewportWidth - rect.left;
    const shouldAlignRight = spaceRight < dropdownWidth;

    let top: number;
    let left: number;

    if (shouldOpenUpward) {
      top = rect.top + window.scrollY - Math.min(dropdownMaxHeight, spaceAbove) - spacing;
    } else {
      top = rect.bottom + window.scrollY + spacing;
    }

    if (shouldAlignRight) {
      left = rect.right + window.scrollX - dropdownWidth;
    } else {
      left = rect.left + window.scrollX;
    }

    left = Math.max(spacing, Math.min(left, viewportWidth - dropdownWidth - spacing + window.scrollX));
    top = Math.max(spacing + window.scrollY, top);

    setDropdownPosition({
      top,
      left,
      width: rect.width
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition.current();

    let rafId: number;
    const handlePositionUpdate = () => {
      rafId = requestAnimationFrame(() => {
        updatePosition.current();
      });
    };

    const handleScroll = () => {
      handlePositionUpdate();
    };

    const handleResize = () => {
      handlePositionUpdate();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredLanguages = ALL_LANGUAGES.filter(lang =>
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLang = ALL_LANGUAGES.find(l => l.code === value);

  const displayText = selectedLang?.nativeName || 'English';

  const handleSelect = (langCode: string) => {
    onChange(langCode);
    setIsOpen(false);
    setSearchQuery('');
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls="language-dropdown"
        aria-label={`${t.languageSelectorSearch || 'Select language'}: ${displayText}`}
        className="flex items-center gap-2 text-sm border border-border-default rounded-lg px-3 py-2 hover:border-keyLight/40 hover:bg-scene-fillLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight focus-visible:ring-offset-2 focus-visible:ring-offset-scene-bg text-text-primary bg-scene-fill transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-w-[160px] md:min-w-[180px] justify-between w-full sm:w-auto shadow-depth-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Languages className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <span className="truncate font-medium">{displayText}</span>
        </div>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          id="language-dropdown"
          role="listbox"
          aria-label={t.languageSelectorSearch || 'Language selection'}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: '320px',
            zIndex: 9999
          }}
          className="dropdown-menu bg-scene-fill rounded-xl shadow-depth-xl border border-keyLight/20 max-h-96 overflow-hidden animate-scale-in"
        >
          <div className="p-3 border-b border-border-default sticky top-0 bg-scene-fill backdrop-blur-sm z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.languageSelectorSearch}
                aria-label={t.languageSelectorSearch || 'Search languages'}
                className="w-full pl-10 pr-3 py-2 text-sm bg-scene-fillLight border border-border-default rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight focus-visible:border-keyLight text-text-primary placeholder:text-text-tertiary transition-all duration-300"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-keyLight/20 scrollbar-track-transparent">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = value === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full px-4 py-3 text-left hover:bg-keyLight/10 flex items-center justify-between transition-colors duration-200 group ${
                      isSelected ? 'bg-keyLight/15' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-sm font-medium ${isSelected ? 'text-keyLight' : 'text-text-primary'} group-hover:text-keyLight transition-colors duration-200`}>
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-text-tertiary">{lang.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-keyLight flex-shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-secondary font-medium mb-1">
                  {t.languageSelectorNoResults}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t.languageSelectorTryAgain || 'Try a different search term'}
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
