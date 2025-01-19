import { SUPABASE_URL, SUPABASE_KEY } from '../config/supabase.js';

const SubscriptionForm = () => {
    const [email, setEmail] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaQuestion, setCaptchaQuestion] = useState(() => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return { num1, num2, answer: num1 + num2 };
    });

    // Initialize Supabase client
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('invalid-email');
            return;
        }

        // Validate captcha
        if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
            setStatus('captcha-error');
            return;
        }

        try {
            setIsSubmitting(true);

            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('subscribers')
                .select('email')
                .eq('email', email.toLowerCase().trim())
                .single();

            if (existingUser) {
                setStatus('already-subscribed');
                return;
            }

            // Insert new subscriber
            const { error } = await supabase
                .from('subscribers')
                .insert([
                    { 
                        email: email.toLowerCase().trim(),
                        preferences: { email: true, sms: false }
                    }
                ]);

            if (error) throw error;

            // Success
            setStatus('success');
            setEmail('');
            setCaptchaAnswer('');
            
            // Generate new captcha
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            setCaptchaQuestion({ num1, num2, answer: num1 + num2 });

        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-center">Subscribe to Owl Updates</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                        What is {captchaQuestion.num1} + {captchaQuestion.num2}?
                    </label>
                    <input
                        type="number"
                        id="captcha"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>

            {status === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700">Successfully subscribed! Check your email for updates.</p>
                </div>
            )}

            {status === 'already-subscribed' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700">This email is already subscribed to updates!</p>
                </div>
            )}

            {status === 'invalid-email' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700">Please enter a valid email address.</p>
                </div>
            )}

            {status === 'captcha-error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700">Incorrect answer. Please try again.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700">An error occurred. Please try again later.</p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionForm;
