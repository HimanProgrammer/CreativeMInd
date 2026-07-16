// Shared fallback blog posts — shown when the Supabase `blog_posts` table has
// no published rows yet. Both the blog grid and the blog-details page read from
// this so every card on the grid opens a real article by slug.

export const STATIC_POSTS = [
  {
    slug: 'high-performance-website-2025',
    title: 'Why Your Business Needs a High-Performance Website in 2025',
    category: 'Web Development',
    date: 'January 12, 2025',
    author: 'CreativeMind',
    excerpt: 'Your website is your hardest-working salesperson. In 2025, speed, mobile experience and SEO decide whether visitors stay or bounce.',
    content: `A slow, outdated website quietly costs you customers every single day. Studies show that more than half of visitors leave a page that takes longer than three seconds to load.

## Speed is the new first impression
A high-performance website loads instantly, feels smooth on every device, and keeps users engaged. Fast sites rank higher on Google and convert far more visitors into leads.

## Built for mobile, built for growth
The majority of your traffic is on mobile. A modern, responsive design ensures your brand looks flawless on every screen — from phones to desktops.

## What we deliver
At CreativeMind we build custom, lightning-fast websites with clean code, perfect Lighthouse scores and SEO baked in — so your business is ready to grow in 2025 and beyond.`,
  },
  {
    slug: 'flutter-vs-react-native',
    title: 'Flutter vs React Native: Which is Right for Your Mobile App?',
    category: 'Mobile Apps',
    date: 'February 28, 2025',
    author: 'CreativeMind',
    excerpt: 'Both frameworks let you build for iOS and Android from one codebase — but the right choice depends on your goals, team and timeline.',
    content: `Choosing the right cross-platform framework can save you months of development time and thousands in cost. The two leaders are Flutter and React Native.

## Flutter
Google's Flutter delivers beautiful, pixel-perfect UIs and buttery 60fps performance. It's ideal when design and smooth animations are a priority.

## React Native
Backed by Meta, React Native lets teams reuse web/JavaScript skills and taps into a huge ecosystem. It's great for getting to market fast with a lean team.

## Our recommendation
There's no single winner — we help you pick based on your product goals, then build a native-quality app that your users will love.`,
  },
  {
    slug: 'ui-ux-mistakes',
    title: '5 UI/UX Mistakes That Are Killing Your App Conversions',
    category: 'UI/UX Design',
    date: 'March 15, 2025',
    author: 'CreativeMind',
    excerpt: 'Great design is invisible. These five common mistakes create friction that quietly drives users away before they convert.',
    content: `Even a powerful app fails if users can't figure out how to use it. Here are the five UX mistakes we see most often.

## 1. Cluttered onboarding
Asking for too much, too soon. Great apps show value first and ask for details later.

## 2. Hidden calls-to-action
If users can't find the button, they can't convert. Make primary actions obvious.

## 3. Slow, janky screens
Every extra second of load or lag loses users. Performance is a feature.

## 4. Inconsistent design
Mismatched fonts, colors and spacing erode trust. Consistency feels professional.

## 5. Ignoring feedback states
Users need to know what's happening — loading, success and error states matter.

Fix these and watch your conversions climb.`,
  },
  {
    slug: 'strong-brand-identity',
    title: 'How a Strong Brand Identity Turns Visitors Into Loyal Customers',
    category: 'Branding',
    date: 'April 02, 2025',
    author: 'CreativeMind',
    excerpt: 'A memorable brand is more than a logo — it is the feeling people get when they interact with your business.',
    content: `People buy from brands they recognise and trust. A strong, consistent identity is what turns a one-time visitor into a loyal customer.

## More than a logo
Your brand is your colors, typography, voice and the emotion you evoke. Together they make you instantly recognisable.

## Consistency builds trust
When every touchpoint — website, social media, packaging — feels unified, customers feel confident choosing you.

## Stand out from the crowd
A distinctive identity separates you from competitors and gives customers a reason to remember you. We craft brand identities that do exactly that.`,
  },
  {
    slug: 'seo-2025',
    title: 'SEO in 2025: What Actually Works and What to Stop Doing',
    category: 'Digital Marketing',
    date: 'April 20, 2025',
    author: 'CreativeMind',
    excerpt: 'Search is changing fast. Focus on genuine value and technical health — and stop chasing outdated tricks.',
    content: `SEO in 2025 rewards businesses that genuinely help their audience. Here's what matters now.

## What works
High-quality, helpful content that answers real questions. Fast, mobile-friendly, technically healthy websites. Strong topical authority built over time.

## What to stop
Keyword stuffing, spammy backlinks and thin, AI-spun pages. Search engines are smarter than ever and penalise shortcuts.

## The bottom line
Rank higher by being genuinely useful. We build SEO strategies that compound month after month — no gimmicks.`,
  },
  {
    slug: 'social-media-real-leads',
    title: 'Social Media Marketing That Generates Real Leads, Not Just Likes',
    category: 'Social Media',
    date: 'May 10, 2025',
    author: 'CreativeMind',
    excerpt: 'Vanity metrics feel good but pay no bills. Here is how to turn your social presence into a real pipeline.',
    content: `Likes and followers are nice, but leads and sales are what grow your business. Here's how to make social media actually work.

## Content with a purpose
Every post should educate, entertain or inspire action. We design content that stops the scroll and drives clicks.

## Turn attention into action
Clear calls-to-action, lead magnets and retargeting turn casual viewers into genuine enquiries.

## Track what matters
We measure reach, engagement and — most importantly — the leads and revenue your social channels generate.

Real strategy beats random posting every time.`,
  },
];

export function findStaticPost(slug) {
  return STATIC_POSTS.find((p) => p.slug === slug) || null;
}
