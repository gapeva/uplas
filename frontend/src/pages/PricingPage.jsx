import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import api from '../lib/api';

export default function PricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Backend: SubscriptionPlanViewSet
                const res = await api.get('/payments/plans/');
                setPlans(res.data.results || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (planId) => {
        try {
            // Logic to initiate Paystack payment or create subscription
            const res = await api.post('/payments/subscriptions/', { plan: planId });
            alert("Subscription initiated! (Integration with Payment Gateway required here)");
            // Redirect to payment URL if provided by backend
        } catch (err) {
            alert("Please login to subscribe.");
        }
    };

    if (loading) return <div className="py-20 text-center">Loading plans...</div>;

    return (
        <div className="py-20 container text-center">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-gray-600 mb-16">Choose the plan that best fits your learning journey.</p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map(plan => (
                    <div key={plan.id} className="card p-8 border rounded-2xl hover:shadow-xl transition-shadow flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-4xl font-bold mb-6">
                            ${plan.price} <span className="text-base font-normal text-gray-500">/{plan.billing_cycle}</span>
                        </div>
                        <ul className="space-y-3 mb-8 text-left flex-1">
                            {plan.features && plan.features.map((feature, i) => (
                                <li key={i} className="flex gap-2">
                                    <Check className="text-green-500 shrink-0" size={20}/>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleSubscribe(plan.id)}
                            className="w-full py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800"
                        >
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
