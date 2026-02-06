import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import api from '../lib/api';

// Simple FAQ Component
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4 last:border-0">
            <button 
                className="w-full text-left font-semibold flex justify-between items-center focus:outline-none hover:text-blue-600 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                {question}
                <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
            {isOpen && (
                <div className="mt-3 text-gray-600 text-sm leading-relaxed animate-fadeIn">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function PricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get('/payments/plans/');
                setPlans(res.data.results || res.data);
            } catch (err) {
                console.error(err);
                // Fallback mock data if API fails or is empty for demo
                if (!plans.length) {
                    setPlans([
                        { id: 'free', name: 'Free', price: 0, billing_cycle: 'month', features: ['Access to intro modules', 'Limited AI Tutor', 'Community Access'] },
                        { id: 'monthly', name: 'Monthly', price: 29, billing_cycle: 'month', features: ['Full course library', 'Unlimited AI Tutor', 'Projects & Certificates', 'Priority Support'] },
                        { id: 'yearly', name: 'Yearly', price: 299, billing_cycle: 'year', features: ['Everything in Monthly', '2 Months Free', 'Early Access to New Courses', 'Offline Downloads'] }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-blue-600 text-white py-20 text-center">
                <div className="container px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the Perfect Plan for Your Future</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Transparent pricing, incredible value. Choose how you want to learn and grow with Uplas.
                    </p>
                </div>
            </section>

            {/* Plans Grid */}
            <div className="container px-4 py-20 -mt-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={plan.id} className={`bg-white p-8 rounded-2xl shadow-xl border flex flex-col relative ${idx === 1 ? 'border-blue-500 ring-4 ring-blue-500/10 transform md:-translate-y-4' : 'border-gray-100'}`}>
                            {idx === 1 && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Best Value
                                </span>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-6 text-gray-900">
                                ${plan.price} <span className="text-base font-normal text-gray-500">/{plan.billing_cycle}</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">
                                {plan.price === 0 ? "Get a taste of our platform." : idx === 1 ? "Ideal for flexible learning." : "Commit to your growth."}
                            </p>
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features && plan.features.map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                                        <Check className="text-green-500 shrink-0" size={18}/>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-bold transition ${
                                idx === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}>
                                {plan.price === 0 ? "Get Started Free" : "Choose Plan"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <section className="py-20 bg-gray-50">
                <div className="container max-w-3xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border">
                        <FaqItem 
                            question="What payment methods do you accept?" 
                            answer="We accept all major credit cards, debit cards, and bank transfers through our secure payment partner, Paystack."
                        />
                        <FaqItem 
                            question="Can I cancel my subscription anytime?" 
                            answer="Yes, absolutely. You can cancel your Monthly or Yearly subscription at any time from your account dashboard."
                        />
                        <FaqItem 
                            question="What is the difference between the plans?" 
                            answer="The Free plan offers limited content. The Monthly and Yearly plans offer full access to all courses, with the Yearly plan providing a significant discount."
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 container px-4 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Have a Larger Team?</h2>
                <p className="text-gray-600 mb-8">
                    Our Enterprise plan is designed for organizations looking to upskill their entire team. 
                    Let's talk about your specific needs.
                </p>
                <div className="bg-white p-8 rounded-2xl shadow-lg border text-left">
                     <form className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                            <input type="email" className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows="4" className="w-full border rounded-lg px-4 py-2"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800">
                                Contact Sales
                            </button>
                        </div>
                     </form>
                </div>
            </section>
        </div>
    );
}
