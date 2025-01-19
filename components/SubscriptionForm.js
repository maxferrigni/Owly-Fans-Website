// Simplified Test SubscriptionForm.js
import React from 'react';

const SubscriptionForm = () => {
    return (
        <div className="p-4 border border-gray-300 rounded-md bg-white max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center">Test Subscription Form</h2>
            <form>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="block w-full p-2 border rounded mb-4"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SubscriptionForm;
