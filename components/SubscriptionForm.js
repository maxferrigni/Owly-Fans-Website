import { supabase } from '../config/supabase.js';

async function subscribe() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    messageDiv.textContent = '';
    messageDiv.className = 'message';

    if (!name || !email) {
        messageDiv.textContent = 'Please fill out all fields.';
        messageDiv.className = 'message error';
        return;
    }

    try {
        console.log('Attempting to insert data into Supabase...');
        const { error } = await supabase
            .from('subscribers')
            .insert([{ name, email }]);

        if (error) {
            console.error('Error inserting data:', error);
            messageDiv.textContent = 'Failed to subscribe. Please try again.';
            messageDiv.className = 'message error';
        } else {
            console.log('Successfully subscribed!');
            messageDiv.textContent = 'Successfully subscribed!';
            messageDiv.className = 'message success';

            nameInput.value = '';
            emailInput.value = '';
        }
    } catch (err) {
        console.error('Error:', err);
        messageDiv.textContent = 'An unexpected error occurred.';
        messageDiv.className = 'message error';
    }
}

export { subscribe };
