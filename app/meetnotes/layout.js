import './meetnotes.css';

export const metadata = {
  title: {
    default: 'MeetNotes — AI meeting notes for Hindi, English & Hinglish',
    template: '%s | MeetNotes by Creative Mind',
  },
  description:
    'Record any meeting or client call and get a clean summary, decisions, action items and a ready-to-send follow-up — in Hinglish, English or Hindi. Plus Voice Flow: speak messy, get polished text.',
  manifest: '/meetnotes/manifest.webmanifest',
  alternates: { canonical: '/meetnotes/' },
  appleWebApp: { capable: true, title: 'MeetNotes', statusBarStyle: 'black-translucent' },
  icons: { icon: '/meetnotes/icon-192.png', apple: '/meetnotes/icon-192.png' },
};

export const viewport = {
  themeColor: '#001140',
  width: 'device-width',
  initialScale: 1,
};

export default function MeetNotesLayout({ children }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <div className="mn">{children}</div>
    </>
  );
}
