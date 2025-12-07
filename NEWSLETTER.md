# Newsletter Setup Guide

## Current Implementation: Formspree (FREE & Easy!)

We're using **Formspree** - a free service that handles form submissions without any backend code.

### Why Formspree?
- ✅ **100% Free** for up to 50 submissions/month
- ✅ **No API keys needed**
- ✅ **No server required**
- ✅ **Email notifications**
- ✅ **Export to CSV**
- ✅ **Spam protection**

### Setup Steps (2 minutes):

1. **Go to [formspree.io](https://formspree.io)** and sign up (free)

2. **Create a new form:**
   - Click "New Form"
   - Name it "Newsletter Subscription"
   - Copy your form endpoint (looks like: `https://formspree.io/f/YOUR_FORM_ID`)

3. **Update the code:**
   - Open `js/newsletter.js`
   - Find line with `FORMSPREE_ENDPOINT`
   - Replace `YOUR_FORM_ID` with your actual form ID

4. **Done!** Subscribers will be emailed to you automatically.

### Features You Get:
- Email notifications when someone subscribes
- Dashboard to view all subscribers
- Export subscribers to CSV
- Spam filtering
- Auto-responder emails (optional)

---

## Alternative Free Services

### 1. **Formspree** (Current - RECOMMENDED)
- **Free tier:** 50 submissions/month
- **Setup:** 2 minutes, no code
- **Best for:** Small blogs, getting started
- **Link:** [formspree.io](https://formspree.io)

### 2. **EmailOctopus**
- **Free tier:** 2,500 subscribers, 10,000 emails/month
- **Setup:** 10 minutes, requires API
- **Best for:** Growing audience
- **Link:** [emailoctopus.com](https://emailoctopus.com)

### 3. **Sender.net**
- **Free tier:** 2,500 subscribers, 15,000 emails/month
- **Setup:** 15 minutes
- **Best for:** Professional newsletters
- **Link:** [sender.net](https://sender.net)

### 4. **MailerLite**
- **Free tier:** 1,000 subscribers, 12,000 emails/month
- **Setup:** 10 minutes
- **Best for:** Email campaigns
- **Link:** [mailerlite.com](https://mailerlite.com)

### 5. **Brevo (formerly Sendinblue)**
- **Free tier:** Unlimited contacts, 300 emails/day
- **Setup:** 15 minutes
- **Best for:** Transactional emails
- **Link:** [brevo.com](https://brevo.com)

---

## Quick Comparison

| Service | Free Subscribers | Free Emails/Month | Setup Time | Difficulty |
|---------|-----------------|-------------------|------------|------------|
| **Formspree** | Unlimited | 50 | 2 min | ⭐ Easy |
| EmailOctopus | 2,500 | 10,000 | 10 min | ⭐⭐ Medium |
| Sender.net | 2,500 | 15,000 | 15 min | ⭐⭐ Medium |
| MailerLite | 1,000 | 12,000 | 10 min | ⭐⭐ Medium |
| Brevo | Unlimited | 9,000 | 15 min | ⭐⭐⭐ Hard |
| Mailchimp | 500 | 1,000 | 20 min | ⭐⭐⭐ Hard |

---

## Current Setup (Formspree)

The newsletter is already configured to work with Formspree. Just:

1. Sign up at formspree.io
2. Get your form ID
3. Update `FORMSPREE_ENDPOINT` in `js/newsletter.js`
4. Deploy!

That's it! No serverless functions, no API keys, no complexity.

---

## Switching Services

If you want to switch to another service later:

1. **EmailOctopus:** Update `subscribeViaEmailOctopus()` method
2. **MailerLite:** Update `subscribeViaMailerLite()` method
3. **Brevo:** Update `subscribeViaBrevo()` method

All methods are already in the code, just uncomment and configure!

---

## Export Subscribers

**From Formspree:**
- Login to formspree.io
- Go to your form
- Click "Export" → Download CSV

**From LocalStorage (backup):**
- Open browser console
- Type: `exportSubscribers()`
- Download CSV

---

## Privacy & Compliance

- Add privacy policy page
- Include unsubscribe option
- Comply with GDPR (EU) and CAN-SPAM (US)
- Store consent timestamp

---

## Support

- Formspree docs: [help.formspree.io](https://help.formspree.io)
- Issues? Check browser console for errors
- Test with your own email first!
