'use client';
import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const METRIC_TABS = [
  { key: 'users',     label: 'Users',      color: '#6c63ff' },
  { key: 'sessions',  label: 'Sessions',   color: '#00bfa5' },
  { key: 'pageviews', label: 'Page Views', color: '#f05a28' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <p style={{ color: '#888', fontSize: 11, margin: '0 0 6px', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#ccc', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('users');
  const [chartType, setChartType] = useState('line');
  const [range, setRange] = useState('14d');

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: 32, textAlign: 'center',
    }}>
      <div style={{
        width: 32, height: 32, border: '3px solid rgba(108,99,255,0.15)',
        borderTopColor: '#6c63ff', borderRadius: '50%',
        margin: '0 auto 12px', animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#555', fontSize: 13 }}>Loading Analytics...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  if (!data) return null;

  const { totals, dailyChart, topPages, channels, source } = data;
  const activeColor = METRIC_TABS.find(t => t.key === activeMetric)?.color || '#6c63ff';

  const TOTAL_CARDS = [
    { label: 'Users',         value: totals.users?.toLocaleString(),    icon: '👤', color: '#6c63ff', sub: '14-day total' },
    { label: 'Sessions',      value: totals.sessions?.toLocaleString(), icon: '🔄', color: '#00bfa5', sub: '14-day total' },
    { label: 'Page Views',    value: totals.pageviews?.toLocaleString(),icon: '📄', color: '#f05a28', sub: '14-day total' },
    { label: 'Bounce Rate',   value: `${totals.bounceRate}%`,           icon: '↩️', color: '#e040fb', sub: 'Avg. bounce' },
    { label: 'Avg. Duration', value: totals.avgDuration,                icon: '⏱️', color: '#f59e0b', sub: 'Per session' },
  ];

  return (
    <div style={{ marginBottom: 28 }}>

      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f4842c, #e63946)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>
            📊
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>
              Google Analytics
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: source === 'live' ? '#10b981' : '#f59e0b' }} />
              <span style={{ color: source === 'live' ? '#10b981' : '#f59e0b', fontSize: 11, fontWeight: 600 }}>
                {source === 'live' ? 'Live Data' : 'Demo Data — Configure GA4 to see real stats'}
              </span>
            </div>
          </div>
        </div>

        {source !== 'live' && (
          <a
            href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '7px 14px', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8, color: '#f59e0b', fontSize: 11, fontWeight: 600,
              textDecoration: 'none', background: 'rgba(245,158,11,0.08)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ⚙ Connect GA4
          </a>
        )}
      </div>

      {/* Metric Total Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
        {TOTAL_CARDS.map((c) => (
          <div key={c.label} style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeMetric === c.label.toLowerCase().replace('. ','').replace(' ','') ? c.color + '40' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 12, padding: '16px 18px',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <span style={{ color: '#666', fontSize: 11, fontWeight: 600 }}>{c.label}</span>
            </div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{c.value}</div>
            <div style={{ color: '#555', fontSize: 10 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Chart Card */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '24px', marginBottom: 20,
      }}>
        {/* Chart controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {METRIC_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveMetric(tab.key)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: activeMetric === tab.key ? tab.color : 'rgba(255,255,255,0.05)',
                  color: activeMetric === tab.key ? '#fff' : '#666',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['line','bar'].map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: chartType === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: chartType === t ? '#fff' : '#555',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'line' ? '📈 Line' : '📊 Bar'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={240}>
          {chartType === 'line' ? (
            <LineChart data={dailyChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey={activeMetric} stroke={activeColor}
                strokeWidth={2.5} dot={false}
                activeDot={{ r: 5, fill: activeColor, stroke: '#0a0a18', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={dailyChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeMetric} fill={activeColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Top Pages + Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Top Pages */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '22px',
        }}>
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📄</span> Top Pages
          </h3>
          {topPages.map((p, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#555', fontSize: 10, fontWeight: 700, minWidth: 14 }}>#{i + 1}</span>
                  <span style={{ color: '#ccc', fontSize: 12, fontWeight: 600 }}>{p.title}</span>
                </div>
                <span style={{ color: '#6c63ff', fontSize: 12, fontWeight: 700 }}>{p.views.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${p.pct}%`,
                  background: `linear-gradient(90deg, #6c63ff, #e040fb)`,
                  borderRadius: 4, transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Channels */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '22px',
        }}>
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔀</span> Traffic Channels
          </h3>

          {/* Visual donut-style bars */}
          <div style={{ marginBottom: 20 }}>
            {channels.map((ch, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: ch.color }} />
                    <span style={{ color: '#ccc', fontSize: 12, fontWeight: 500 }}>{ch.name}</span>
                  </div>
                  <span style={{ color: ch.color, fontSize: 12, fontWeight: 700 }}>{ch.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${ch.pct}%`,
                    background: ch.color, borderRadius: 6,
                    boxShadow: `0 0 8px ${ch.color}60`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* GA link */}
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 0', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: '#555', textDecoration: 'none',
              fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 15 }}>📊</span>
            Open Google Analytics Dashboard →
          </a>
        </div>
      </div>

      {/* Setup instructions if demo */}
      {source !== 'live' && (
        <div style={{
          marginTop: 16,
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚙️</span>
          <div>
            <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              To show live GA4 data, add these to <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>.env.local</code>
            </div>
            <code style={{ color: '#aaa', fontSize: 11, lineHeight: 1.8, display: 'block' }}>
              GA4_PROPERTY_ID=<span style={{ color: '#f59e0b' }}>your_numeric_property_id</span><br/>
              GA4_CLIENT_EMAIL=<span style={{ color: '#f59e0b' }}>service-account@project.iam.gserviceaccount.com</span><br/>
              GA4_PRIVATE_KEY=<span style={{ color: '#f59e0b' }}>&quot;-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n&quot;</span>
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
