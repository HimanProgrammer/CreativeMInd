// MeetNotes — product settings in one place. Edit prices, limits and contact
// details here; the landing page, the app and the upgrade prompts all read it.
// Keep the minute limits in step with public.meetnotes_consume() in Supabase.

export const MEETNOTES = {
  name: 'MeetNotes',
  tagline: 'AI meeting notes & voice flow — by Creative Mind',
  whatsapp: '917888113974', // +91 78881 13974, used for "Upgrade" / "Talk to us"
  plans: [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      per: 'forever',
      minutes: 60,
      features: ['60 minutes of recording a month', 'AI summary, decisions & action items', 'Voice Flow dictation', 'Hindi, English & Hinglish'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹499',
      per: 'per month',
      minutes: 1800,
      highlight: true,
      features: ['30 hours of recording a month', 'Upload Zoom / Meet / call recordings', 'Follow-up WhatsApp & email drafts', 'Unlimited saved meetings'],
    },
    {
      id: 'business',
      name: 'Business',
      price: '₹1,499',
      per: 'per month',
      minutes: 6000,
      features: ['100 hours a month', 'For teams up to 5 people', 'Priority support on WhatsApp', 'Custom branding on request'],
    },
  ],
};

export const NOTE_LANGS = [
  { id: 'hinglish', label: 'Hinglish', prompt: 'Hinglish (Hindi written in Roman script, mixed naturally with English)' },
  { id: 'english', label: 'English', prompt: 'English' },
  { id: 'hindi', label: 'हिंदी', prompt: 'Hindi in Devanagari script' },
];

export const FLOW_STYLES = [
  { id: 'clean', label: 'Clean text', prompt: 'clean, well-punctuated text' },
  { id: 'whatsapp', label: 'WhatsApp reply', prompt: 'a short, friendly WhatsApp message' },
  { id: 'email', label: 'Professional email', prompt: 'a professional email with a subject line on the first line as "Subject: ..."' },
  { id: 'bullets', label: 'Bullet notes', prompt: 'concise bullet-point notes' },
  { id: 'to-en', label: 'Translate → English', prompt: 'clear English (translate if needed)' },
  { id: 'to-hi', label: 'Translate → Hindi', prompt: 'natural Hindi in Devanagari script (translate if needed)' },
];
