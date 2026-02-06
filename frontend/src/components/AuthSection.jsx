import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { cn, validateEmail, validatePassword } from '../lib/utils'

export default function AuthSection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('signup')
  
  const handleRegistrationSuccess = () => {
    setActiveTab('login')
  }
  
  return (
    <section id="auth-section" className="py-20">
      <div className="container max-w-lg">
        {/* Tab Buttons */}
        <div className="flex bg-light-border dark:bg-dark-border rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('signup')}
            className={cn(
              'flex-1 py-3 rounded-lg font-medium transition-colors',
              activeTab === 'signup'
                ? 'bg-white dark:bg-dark-panel text-primary dark:text-secondary shadow-sm'
                : 'text-light-text-secondary dark:text-dark-text-secondary'
            )}
          >
            {t('signup_tab')}
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={cn(
              'flex-1 py-3 rounded-lg font-medium transition-colors',
              activeTab === 'login'
                ? 'bg-white dark:bg-dark-panel text-primary dark:text-secondary shadow-sm'
                : 'text-light-text-secondary dark:text-dark-text-secondary'
            )}
          >
            {t('login_tab')}
          </button>
        </div>

        {/* Forms */}
        <div className="card p-6 md:p-8">
          {activeTab === 'signup' ? <SignupForm onSuccess={handleRegistrationSuccess} /> : <LoginForm />}
        </div>
      </div>
    </section>
  )
}

function SignupForm({ onSuccess }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, login, isLoading } = useAuthStore()
  
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm()
  const password = watch('password')

  const industries = [
    'Technology', 'Healthcare', 'Finance & Banking', 'Education',
    'Manufacturing & Engineering', 'Retail & E-commerce',
    'Marketing & Advertising', 'Arts & Entertainment', 'Student', 'Other'
  ]

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['fullName'],
      2: ['email'],
      3: ['industry'],
      4: ['profession', 'phone'],
    }
    
    const isValid = await trigger(fieldsToValidate[step])
    if (isValid && step < 5) setStep(step + 1)
  }

  const onSubmit = async (data) => {
    const userData = {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
      organization: data.organization || '',
      industry: data.industry,
      profession: data.profession,
      phone: data.phone,
    }

    const result = await registerUser(userData)
    if (result.success) {
      toast.success('Account created! Logging you in...')
      // Auto-login after successful registration
      const loginResult = await login(data.email, data.password)
      if (loginResult.success) {
        toast.success('Welcome to Uplas!')
        window.location.href = '/dashboard'
      } else {
        // If auto-login fails, switch to login tab
        toast.success('Account created! Please login.')
        setStep(1)
        onSuccess?.()
      }
    } else {
      toast.error(result.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-semibold mb-2">{t('signup_title')}</h3>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
        Step {step} of 5
      </p>

      {/* Step 1: Full Name */}
      {step === 1 && (
        <div className="animate-fade-in">
          <label className="label">{t('label_fullname')}</label>
          <input
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
            className={cn('input', errors.fullName && 'error')}
            placeholder={t('placeholder_fullname')}
          />
          {errors.fullName && <p className="text-error text-sm mt-1">{errors.fullName.message}</p>}
        </div>
      )}

      {/* Step 2: Email */}
      {step === 2 && (
        <div className="animate-fade-in">
          <label className="label">{t('label_email')}</label>
          <input
            {...register('email', { required: 'Email is required', validate: v => validateEmail(v) || 'Invalid email' })}
            type="email"
            className={cn('input', errors.email && 'error')}
            placeholder={t('placeholder_email')}
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
        </div>
      )}

      {/* Step 3: Industry & Organization */}
      {step === 3 && (
        <div className="animate-fade-in space-y-4">
          <div>
            <label className="label">{t('label_organization')} (Optional)</label>
            <input
              {...register('organization')}
              className="input"
              placeholder={t('placeholder_organization')}
            />
          </div>
          <div>
            <label className="label">{t('label_industry')}</label>
            <select
              {...register('industry', { required: 'Please select an industry' })}
              className={cn('input', errors.industry && 'error')}
            >
              <option value="">Select your industry...</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            {errors.industry && <p className="text-error text-sm mt-1">{errors.industry.message}</p>}
          </div>
        </div>
      )}

      {/* Step 4: Profession & Phone */}
      {step === 4 && (
        <div className="animate-fade-in space-y-4">
          <div>
            <label className="label">{t('label_profession')}</label>
            <input
              {...register('profession', { required: 'Profession is required' })}
              className={cn('input', errors.profession && 'error')}
              placeholder={t('placeholder_profession')}
            />
            {errors.profession && <p className="text-error text-sm mt-1">{errors.profession.message}</p>}
          </div>
          <div>
            <label className="label">{t('label_phone')}</label>
            <input
              {...register('phone', { required: 'Phone number is required' })}
              type="tel"
              className={cn('input', errors.phone && 'error')}
              placeholder="e.g., +1 234 567 8900"
            />
            {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      )}

      {/* Step 5: Password */}
      {step === 5 && (
        <div className="animate-fade-in space-y-4">
          <div>
            <label className="label">{t('label_password')}</label>
            <div className="relative">
              <input
                {...register('password', { 
                  required: 'Password is required',
                  validate: v => validatePassword(v) || 'Password must be 8+ chars with uppercase, lowercase, number, and special char'
                })}
                type={showPassword ? 'text' : 'password'}
                className={cn('input pr-12', errors.password && 'error')}
                placeholder={t('placeholder_password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-light-text-secondary mt-1">{t('password_hint')}</p>
            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">{t('label_confirm_password')}</label>
            <input
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: v => v === password || 'Passwords do not match'
              })}
              type="password"
              className={cn('input', errors.confirmPassword && 'error')}
              placeholder={t('placeholder_confirm_password')}
            />
            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-start gap-2">
            <input
              {...register('terms', { required: 'You must agree to the terms' })}
              type="checkbox"
              id="terms"
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm">
              {t('terms_agree')} <a href="/terms" className="link">{t('terms_link')}</a> {t('and')} <a href="/privacy" className="link">{t('privacy_link')}</a>
            </label>
          </div>
          {errors.terms && <p className="text-error text-sm">{errors.terms.message}</p>}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary flex-1">
            <ArrowLeft size={18} /> {t('btn_previous')}
          </button>
        )}
        {step < 5 ? (
          <button type="button" onClick={nextStep} className="btn btn-primary flex-1">
            {t('btn_next')} <ArrowRight size={18} />
          </button>
        ) : (
          <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
            {isLoading ? 'Creating...' : t('btn_create_account')}
          </button>
        )}
      </div>
    </form>
  )
}

function LoginForm() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      toast.success('Welcome back!')
      window.location.href = '/dashboard'
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-semibold mb-6">{t('login_title')}</h3>

      <div className="space-y-4">
        <div>
          <label className="label">{t('label_email')}</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className={cn('input', errors.email && 'error')}
            placeholder={t('placeholder_email')}
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">{t('label_password')}</label>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPassword ? 'text' : 'password'}
              className={cn('input pr-12', errors.password && 'error')}
              placeholder={t('placeholder_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <a href="/forgot-password" className="text-sm link">{t('forgot_password')}</a>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-6">
        {isLoading ? 'Logging in...' : t('btn_login')}
      </button>
    </form>
  )
}
