import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

import { loginSchema } from '@infield/shared';

import { useAuth } from '@/contexts/AuthContext';

// --- Field error type ---

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Refs for focus management
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Validate single field on blur
  const validateField = useCallback(
    (field: 'email' | 'password') => {
      const value = field === 'email' ? email : password;

      if (!value.trim()) {
        setErrors((previous) => ({
          ...previous,
          [field]:
            field === 'email' ? 'נא להזין כתובת אימייל' : 'נא להזין סיסמה',
        }));
        return false;
      }

      const partialData =
        field === 'email'
          ? { email: value, password: 'placeholder' }
          : { email: 'placeholder@test.com', password: value };

      const result = loginSchema.safeParse(partialData);

      if (!result.success) {
        const fieldError = result.error.errors.find(
          (error) => error.path[0] === field
        );
        if (fieldError) {
          setErrors((previous) => ({
            ...previous,
            [field]: fieldError.message,
          }));
          return false;
        }
      }

      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
      return true;
    },
    [email, password]
  );

  // Trigger shake animation
  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  }, []);

  // Handle submit
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      setErrors((previous) => {
        const next = { ...previous };
        delete next.general;
        return next;
      });

      // Validate all fields
      const result = loginSchema.safeParse({ email: email.trim(), password });

      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        for (const error of result.error.errors) {
          const field = error.path[0] as keyof FieldErrors;
          if (!fieldErrors[field]) {
            fieldErrors[field] = error.message;
          }
        }
        setErrors(fieldErrors);
        triggerShake();

        // Focus first error field
        if (fieldErrors.email) {
          emailInputRef.current?.focus();
        } else if (fieldErrors.password) {
          passwordInputRef.current?.focus();
        }
        return;
      }

      setIsSubmitting(true);

      try {
        const { error } = await signIn(email.trim(), password);

        if (error) {
          setErrors({ general: error });
          triggerShake();
        } else {
          navigate('/', { replace: true });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, signIn, navigate, triggerShake]
  );

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div
        className={`
          w-full max-w-md bg-white rounded-[14px] border border-cream-200
          shadow-md p-8
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-rubik font-bold">DF</span>
          </div>
          <h1 className="text-[32px] font-rubik font-bold text-primary-700">
            inField
          </h1>
          <p className="text-[15px] font-rubik text-neutral-500 mt-2">
            התחבר לחשבון שלך
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div
            role="alert"
            className="flex items-center gap-2 bg-danger-50 border border-danger-500 rounded-[10px] px-4 py-3 mb-4"
          >
            <AlertCircle size={18} className="text-danger-500 shrink-0" />
            <p className="text-[13px] font-rubik text-danger-700">
              {errors.general}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[14px] font-rubik text-neutral-700 mb-1.5"
            >
              אימייל
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) {
                  setErrors((previous) => {
                    const next = { ...previous };
                    delete next.email;
                    return next;
                  });
                }
              }}
              onBlur={() => validateField('email')}
              disabled={isSubmitting}
              placeholder="name@example.com"
              dir="ltr"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
              className={`
                w-full h-[50px] rounded-[10px] px-4
                text-[16px] font-rubik text-neutral-700
                bg-cream-50 outline-none
                transition-colors duration-200
                placeholder:text-neutral-400
                focus-visible:ring-2 focus-visible:ring-primary-500/20
                disabled:opacity-50
                ${
                  errors.email
                    ? 'border-[1.5px] border-danger-500 focus-visible:border-danger-500'
                    : 'border-[1.5px] border-cream-300 focus-visible:border-primary-500'
                }
              `}
            />
            {errors.email && (
              <div
                id="email-error"
                role="alert"
                className="flex items-center gap-1 mt-1"
              >
                <AlertCircle size={14} className="text-danger-700 shrink-0" />
                <p className="text-[13px] font-rubik text-danger-700">
                  {errors.email}
                </p>
              </div>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[14px] font-rubik text-neutral-700 mb-1.5"
            >
              סיסמה
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((previous) => {
                      const next = { ...previous };
                      delete next.password;
                      return next;
                    });
                  }
                }}
                onBlur={() => validateField('password')}
                disabled={isSubmitting}
                placeholder="לפחות 8 תווים"
                dir="ltr"
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                aria-invalid={!!errors.password}
                className={`
                  w-full h-[50px] rounded-[10px] px-4 ps-12
                  text-[16px] font-rubik text-neutral-700
                  bg-cream-50 outline-none
                  transition-colors duration-200
                  placeholder:text-neutral-400
                  focus-visible:ring-2 focus-visible:ring-primary-500/20
                  disabled:opacity-50
                  ${
                    errors.password
                      ? 'border-[1.5px] border-danger-500 focus-visible:border-danger-500'
                      : 'border-[1.5px] border-cream-300 focus-visible:border-primary-500'
                  }
                `}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute start-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 rounded"
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.password && (
              <div
                id="password-error"
                role="alert"
                className="flex items-center gap-1 mt-1"
              >
                <AlertCircle size={14} className="text-danger-700 shrink-0" />
                <p className="text-[13px] font-rubik text-danger-700">
                  {errors.password}
                </p>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full h-[52px] rounded-[14px]
              bg-primary-500 hover:bg-primary-600 active:bg-primary-600
              text-white text-[15px] font-rubik font-semibold
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2
              flex items-center justify-center
            "
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              'התחבר'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
