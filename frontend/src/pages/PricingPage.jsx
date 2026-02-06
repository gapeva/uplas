import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'
import useAuthStore from '../store/authStore'
import { cn } from '../lib/utils'
import api from '../lib/api'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceNGN: 0,
    description: 'Perfect for getting started with AI learning',
    features: [
      'Access to 3 free courses',
      'Basic AI Tutor support',
      'Community forum access',
      'Mobile app access',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 29,
    priceNGN: 25000,
    description: 'For serious learners ready to accelerate',
    features: [
      'Unlimited course access',
      'Advanced AI Tutor with personalization',
      'AI-generated projects',
      'Priority community support',
      'Certificate of completion',
      'Text-to-Speech feature',
      'Offline downloads',
    ],
    cta: 'Subscribe Now',
    popular: true,
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 249,
    priceNGN: 200000,
    description: 'Best value - save 28%',
    features: [
      'Everything in Pro Monthly',
      '2 months free',
      'Early access to new features',
      'Annual learning report',
    ],
    cta: 'Subscribe & Save',
    popular: false,
  },
]

export default function PricingPage() {
  const formatPrice = useThemeStore((state) => state.formatPrice)
  const currency = useThemeStore((state) => state.currency)
  const { isAuthenticated, user } = useAuthStore()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      if (!isAuthenticated) {
        window.location.href = '/#auth-section'
      } else {
        toast.success('You already have free access!')
        window.location.href = '/courses'
      }
      return
    }

    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      window.location.href = '/#auth-section'
      return
    }

    setLoadingPlan(plan.id)

    // Test mode - simulate payment
    const TEST_MODE = true
    if (TEST_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Subscribed to ${plan.name}! (Test Mode)`)
      setLoadingPlan(null)
      window.location.href = '/dashboard'
      return
    }

    try {
      const response = await api.post('/v1/payments/subscriptions/initialize-payment/', {
        plan_id: plan.id
      })

      if (response.data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = response.data.authorization_url
      }
    } catch (error) {
      toast.error('Payment initialization failed. Please try again.')
      console.error('Payment error:', error)
    } finally {
      setLoadingPlan(null)
    }
  }

  const getDisplayPrice = (plan) => {
    if (currency === 'NGN') {
      return `₦${plan.priceNGN.toLocaleString()}`
    }
    return formatPrice(plan.price)
  }

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. All plans include our core AI-powered features.
          </p>
          <p className="text-sm text-primary dark:text-secondary mt-4">
            🔒 Secure payments powered by Paystack
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'card p-8 relative',
                plan.popular && 'border-2 border-primary dark:border-secondary'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary dark:bg-secondary text-white dark:text-black text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-4">
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">{getDisplayPrice(plan)}</span>
                {plan.price > 0 && (
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    /{plan.id.includes('yearly') ? 'year' : 'month'}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loadingPlan === plan.id}
                className={cn(
                  'btn w-full',
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                )}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Check out our FAQ or contact our support team.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/#faq-section" className="btn btn-secondary">View FAQ</a>
            <a href="mailto:support@uplas.me" className="btn btn-primary">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
