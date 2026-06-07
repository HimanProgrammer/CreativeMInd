import { NextResponse } from 'next/server';

// GA4 Data API via service account
// Set these env vars in .env.local to enable real data:
//   GA4_PROPERTY_ID=123456789
//   GA4_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
//   GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

const DEMO_DATA = {
  source: 'demo',
  totals: { users: 1284, sessions: 1947, pageviews: 5623, bounceRate: 38.2, avgDuration: '2m 14s' },
  dailyChart: [
    { date: 'Jun 1',  users: 142, sessions: 198, pageviews: 547 },
    { date: 'Jun 2',  users: 165, sessions: 231, pageviews: 612 },
    { date: 'Jun 3',  users: 89,  sessions: 120, pageviews: 334 },
    { date: 'Jun 4',  users: 98,  sessions: 142, pageviews: 401 },
    { date: 'Jun 5',  users: 178, sessions: 247, pageviews: 689 },
    { date: 'Jun 6',  users: 204, sessions: 291, pageviews: 798 },
    { date: 'Jun 7',  users: 186, sessions: 265, pageviews: 712 },
    { date: 'Jun 8',  users: 122, sessions: 174, pageviews: 487 },
    { date: 'Jun 9',  users: 139, sessions: 196, pageviews: 541 },
    { date: 'Jun 10', users: 193, sessions: 271, pageviews: 748 },
    { date: 'Jun 11', users: 211, sessions: 298, pageviews: 821 },
    { date: 'Jun 12', users: 187, sessions: 263, pageviews: 726 },
    { date: 'Jun 13', users: 156, sessions: 219, pageviews: 603 },
    { date: 'Jun 14', users: 174, sessions: 245, pageviews: 675 },
  ],
  topPages: [
    { page: '/', title: 'Home',         views: 1847, pct: 100 },
    { page: '/page-about', title: 'About Us',     views: 923,  pct: 50  },
    { page: '/page-services', title: 'Services',     views: 741,  pct: 40  },
    { page: '/page-portfolio', title: 'Portfolio',    views: 618,  pct: 33  },
    { page: '/page-contact', title: 'Contact',      views: 494,  pct: 27  },
  ],
  channels: [
    { name: 'Organic Search', pct: 42, color: '#6c63ff' },
    { name: 'Direct',         pct: 28, color: '#00bfa5' },
    { name: 'Referral',       pct: 18, color: '#f05a28' },
    { name: 'Social',         pct: 12, color: '#e040fb' },
  ],
};

async function fetchGA4Data() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    return null; // Not configured — use demo
  }

  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
    });

    const [totalsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });

    const [dailyResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    });

    const [channelResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });

    // Parse totals
    const t = totalsResponse.rows?.[0]?.metricValues || [];
    const users = parseInt(t[0]?.value || 0);
    const sessions = parseInt(t[1]?.value || 0);
    const pageviews = parseInt(t[2]?.value || 0);
    const bounceRateRaw = parseFloat(t[3]?.value || 0);
    const avgDurSec = parseFloat(t[4]?.value || 0);
    const mins = Math.floor(avgDurSec / 60);
    const secs = Math.floor(avgDurSec % 60);

    // Parse daily
    const dailyChart = (dailyResponse.rows || []).map(row => {
      const d = row.dimensionValues?.[0]?.value || '';
      const label = `${d.slice(4, 6)}/${d.slice(6, 8)}`;
      return {
        date: label,
        users: parseInt(row.metricValues?.[0]?.value || 0),
        sessions: parseInt(row.metricValues?.[1]?.value || 0),
        pageviews: parseInt(row.metricValues?.[2]?.value || 0),
      };
    });

    // Parse top pages
    const maxViews = parseInt(pagesResponse.rows?.[0]?.metricValues?.[0]?.value || 1);
    const topPages = (pagesResponse.rows || []).map(row => ({
      page: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || 'Unknown',
      views: parseInt(row.metricValues?.[0]?.value || 0),
      pct: Math.round((parseInt(row.metricValues?.[0]?.value || 0) / maxViews) * 100),
    }));

    // Parse channels
    const totalSessions = (channelResponse.rows || []).reduce((sum, r) => sum + parseInt(r.metricValues?.[0]?.value || 0), 0);
    const COLORS = ['#6c63ff', '#00bfa5', '#f05a28', '#e040fb', '#f59e0b'];
    const channels = (channelResponse.rows || []).slice(0, 5).map((row, i) => ({
      name: row.dimensionValues?.[0]?.value || 'Other',
      pct: Math.round((parseInt(row.metricValues?.[0]?.value || 0) / totalSessions) * 100),
      color: COLORS[i] || '#888',
    }));

    return {
      source: 'live',
      totals: {
        users,
        sessions,
        pageviews,
        bounceRate: Math.round(bounceRateRaw * 100) / 100,
        avgDuration: `${mins}m ${secs}s`,
      },
      dailyChart,
      topPages,
      channels,
    };
  } catch (err) {
    console.error('GA4 fetch error:', err.message);
    return null;
  }
}

export async function GET() {
  const real = await fetchGA4Data();
  return NextResponse.json(real || DEMO_DATA);
}
