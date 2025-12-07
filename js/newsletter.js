// Newsletter Subscription Functionality

class NewsletterManager {
    constructor() {
        this.forms = document.querySelectorAll('.newsletter-form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const emailInput = form.querySelector('.newsletter-input');
        const submitBtn = form.querySelector('.newsletter-submit');
        const messageDiv = form.querySelector('.newsletter-message') || this.createMessageDiv(form);

        const email = emailInput.value.trim();

        // Validate email
        if (!this.validateEmail(email)) {
            this.showMessage(messageDiv, 'Please enter a valid email address', 'error');
            return;
        }

        // Disable form during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        try {
            // Use Formspree (FREE - no backend needed!)
            // Sign up at formspree.io and replace YOUR_FORM_ID below
            await this.subscribeViaFormspree(email);

            // Success
            this.showMessage(messageDiv, '🎉 Successfully subscribed! Check your email.', 'success');
            emailInput.value = '';

            // Track subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscribe', {
                    'event_category': 'Newsletter',
                    'event_label': 'Subscribe'
                });
            }

        } catch (error) {
            // Show user-friendly error message
            const errorMessage = error.message || 'Something went wrong. Please try again.';
            this.showMessage(messageDiv, errorMessage, 'error');
            console.error('Newsletter subscription error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    createMessageDiv(form) {
        const div = document.createElement('div');
        div.className = 'newsletter-message';
        form.appendChild(div);
        return div;
    }

    showMessage(div, message, type) {
        div.textContent = message;
        div.className = `newsletter-message ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            div.className = 'newsletter-message';
        }, 5000);
    }

    // Local storage method (for demo/static sites)
    async subscribeLocally(email) {
        return new Promise((resolve) => {
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

            if (subscribers.includes(email)) {
                throw new Error('Already subscribed');
            }

            subscribers.push({
                email: email,
                subscribedAt: new Date().toISOString()
            });

            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

            // Simulate network delay
            setTimeout(resolve, 1000);
        });
    }

    // Mailchimp integration example
    async subscribeToMailchimp(email) {
        // Replace with your Mailchimp endpoint
        const MAILCHIMP_URL = 'YOUR_MAILCHIMP_URL';

        const response = await fetch(MAILCHIMP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed'
            })
        });

        if (!response.ok) {
            throw new Error('Subscription failed');
        }

        return response.json();
    }

    // Formspree (FREE & EASY - Recommended!)
    async subscribeViaFormspree(email) {
        // Replace YOUR_FORM_ID with your actual Formspree form ID
        // Get it from: https://formspree.io (free signup)
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                _subject: 'New Newsletter Subscription',
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                throw new Error(data.errors.map(e => e.message).join(', '));
            }
            throw new Error('Subscription failed');
        }

        return data;
    }

    // Serverless function (Netlify) - Mailchimp Integration
    async subscribeViaServerless(email) {
        const response = await fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Subscription failed');
        }

        return data;
    }
}

// Initialize newsletter manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NewsletterManager();
});

// Export subscribers (admin function)
function exportSubscribers() {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    const csv = 'Email,Subscribed At\n' +
        subscribers.map(s => `${s.email},${s.subscribedAt}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
}

// Make export function available globally
window.exportSubscribers = exportSubscribers;
