// Mailchimp Newsletter Integration
// This serverless function handles Mailchimp API calls securely

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { email } = JSON.parse(event.body);

        // Validate email
        if (!email || !isValidEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email address' })
            };
        }

        // Mailchimp configuration
        // IMPORTANT: Set these as environment variables in Netlify/Vercel
        const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
        const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
        const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., 'us1', 'us6'

        if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
            console.error('Missing Mailchimp configuration');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Mailchimp API endpoint
        const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

        // Subscribe to Mailchimp
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed', // or 'pending' for double opt-in
                tags: ['Website Signup']
            })
        });

        const data = await response.json();

        // Handle Mailchimp response
        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Successfully subscribed!'
                })
            };
        } else if (data.title === 'Member Exists') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'This email is already subscribed!'
                })
            };
        } else {
            console.error('Mailchimp error:', data);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: data.detail || 'Subscription failed'
                })
            };
        }

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error'
            })
        };
    }
};

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
