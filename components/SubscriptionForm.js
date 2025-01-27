import { supabase } from '../config/supabase.js';

async function subscribe() {
    // Get all form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const frequencyInput = document.getElementById('frequency');
    const notificationMethodInputs = document.querySelectorAll('input[name="notificationMethod"]');
    const messageDiv = document.getElementById('message');
    const captchaResponse = grecaptcha.getResponse(); // For Google reCAPTCHA

    // Trim values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const frequency = frequencyInput.value;
    const notificationMethod = Array.from(notificationMethodInputs)
        .filter(input => input.checked)
        .map(input => input.value)
        .join(',');

    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // Validation
    if (!name || !email || !frequency || !notificationMethod) {
        messageDiv.textContent = 'Please fill out all required fields.';
        messageDiv.className = 'message error';
        return;
    }

    // CAPTCHA validation
    if (!captchaResponse) {
        messageDiv.textContent = 'Please complete the CAPTCHA.';
        messageDiv.className = 'message error';
        return;
    }

    try {
        console.log('Attempting to insert data into Supabase...');
        const { error } = await supabase
            .from('subscribers')
            .insert([{ 
                name, 
                email, 
                phone, 
                notification_frequency: frequency,
                notification_method: notificationMethod
            }]);

        if (error) {
            console.error('Error inserting data:', error);
            messageDiv.textContent = 'Failed to subscribe. Please try again.';
            messageDiv.className = 'message error';
        } else {
            console.log('Successfully subscribed!');
            messageDiv.textContent = 'Successfully subscribed!';
            messageDiv.className = 'message success';
            // Clear form
            nameInput.value = '';
            emailInput.value = '';
            phoneInput.value = '';
            frequencyInput.value = 'realtime';
            notificationMethodInputs.forEach(input => input.checked = false);
            grecaptcha.reset();
        }
    } catch (err) {
        console.error('Error:', err);
        messageDiv.textContent = 'An unexpected error occurred.';
        messageDiv.className = 'message error';
    }
}

export { subscribe };
