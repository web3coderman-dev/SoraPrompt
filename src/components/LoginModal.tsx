import { useState } from 'react';
import { Film, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Divider } from './ui/Divider';
import { GoogleIcon } from './ui/GoogleIcon';
import { Checkbox } from './ui/Checkbox';

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      role="link"
      tabIndex={0}
    >
      {children}
    </a>
  );
}

interface LoginModalProps {
  onClose: () => void;
  context?: {
    title?: string;
    message?: string;
  };
}

export default function LoginModal({ onClose, context }: LoginModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(t['auth.loginFailed'] || 'Login failed, please try again');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t['auth.fillAllFields'] || 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError(t.passwordMinLength || 'Password must be at least 6 characters');
      return;
    }

    if (isSignUp && !agreeToTerms) {
      setError(t['auth.agreeToTermsError'] || 'Please agree to the Terms of Service and Privacy Policy to continue');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);

      if (isSignUp) {
        setError(t.signUpError || 'Sign up failed');
      } else {
        setError(t.signInError || 'Sign in failed');
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={false}
      variant="default"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-keyLight to-neon rounded-2xl mb-4 shadow-neon">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h2 id="modal-title" className="text-3xl font-bold font-display text-text-primary mb-2">
            {context?.title || t.title}
          </h2>
          <p className="text-text-secondary">
            {context?.message || (isSignUp
              ? (t['auth.register.title'] || 'Create your account')
              : (t['auth.login.title'] || 'Sign in to continue')
            )}
          </p>
        </div>

        {error && (
          <Alert variant="error" icon={AlertCircle}>
            {error}
          </Alert>
        )}

        <Button
          variant="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <GoogleIcon className="w-5 h-5" />
          {t.continueWithGoogle}
        </Button>

        <Divider text={t.orContinueWith || 'Or continue with'} />

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <Input
            id="email"
            label={t.email || 'Email'}
            icon={Mail}
            iconPosition="left"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder || 'Enter your email'}
            disabled={loading}
          />

          <Input
            id="password"
            label={t.password || 'Password'}
            icon={Lock}
            iconPosition="left"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder || 'Enter your password'}
            disabled={loading}
            helperText={isSignUp ? (t.passwordMinLength || 'Password must be at least 6 characters') : undefined}
          />

          {isSignUp && (
            <Checkbox
              id="agree-terms"
              checked={agreeToTerms}
              onChange={setAgreeToTerms}
              error={error === (t['auth.agreeToTermsError'] || 'Please agree to the Terms of Service and Privacy Policy to continue')}
              label={
                <span>
                  {t['auth.agreeToTermsLabel'] || 'I agree to the'}{' '}
                  <ExternalLink
                    href="/terms"
                    className="text-keyLight hover:text-keyLight/80 transition-colors duration-300 underline underline-offset-2"
                  >
                    {t['auth.terms.termsOfService'] || 'Terms of Service'}
                  </ExternalLink>
                  {' '}{t['auth.terms.and'] || 'and'}{' '}
                  <ExternalLink
                    href="/privacy"
                    className="text-keyLight hover:text-keyLight/80 transition-colors duration-300 underline underline-offset-2"
                  >
                    {t['auth.terms.privacyPolicy'] || 'Privacy Policy'}
                  </ExternalLink>
                  .
                </span>
              }
            />
          )}

          <Button
            type="submit"
            variant="director"
            fullWidth
            disabled={loading || (isSignUp && !agreeToTerms)}
            loading={loading}
          >
            {isSignUp ? (t.signUp || 'Sign Up') : (t.signIn || 'Sign In')}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setAgreeToTerms(false);
            }}
            className="text-sm text-keyLight hover:text-keyLight/80 font-medium transition-colors duration-300"
          >
            {isSignUp
              ? (t.alreadyHaveAccount || 'Already have an account?') + ' ' + (t.signIn || 'Sign In')
              : (t.dontHaveAccount || "Don't have an account?") + ' ' + (t.signUp || 'Sign Up')
            }
          </button>
        </div>

        {!isSignUp && (
          <div className="text-center text-sm text-text-tertiary px-4">
            <p>
              {t['auth.signInTermsNotice'] || 'By continuing, you agree to our'}{' '}
              <ExternalLink
                href="/terms"
                className="text-keyLight hover:text-keyLight/80 transition-colors duration-300 underline underline-offset-2"
              >
                {t['auth.terms.termsOfService'] || 'Terms of Service'}
              </ExternalLink>
              {' '}{t['auth.terms.and'] || 'and'}{' '}
              <ExternalLink
                href="/privacy"
                className="text-keyLight hover:text-keyLight/80 transition-colors duration-300 underline underline-offset-2"
              >
                {t['auth.terms.privacyPolicy'] || 'Privacy Policy'}
              </ExternalLink>
              .
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
