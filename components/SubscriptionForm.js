// Minimalist Subscription Form Logic

// Import Supabase configuration
import { SUPABASE_URL, SUPABASE_KEY } from '/config/supabase.js';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscription function
async function subscribe() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        messageDiv.textContent = 'Please fill out all fields.';
        messageDiv.className = 'message error';
        return;
    }

    try {
        // Insert data into Supabase
        const { error } = await supabase
            .from('subscribers')
            .insert([{ name, email }]);

        if (error) throw error;

        messageDiv.textContent = 'Successfully subscribed!';
        messageDiv.className = 'message success';

        // Clear the form
        nameInput.value = '';
        emailInput.value = '';
    } catch (err) {
        console.error('Subscription error:', err);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
    }
}
