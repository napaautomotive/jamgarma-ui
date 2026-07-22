import Layout from '../components/Layout';
import { DASHBOARD_STATS, CALL_SESSIONS } from '../data/mock';
import { fmtMoney, fmtDuration, fmtDate } from '../utils/format';
import { Users, Phone, TrendingDown, Wallet } from 'lucide-react';

const maxCalls = Math.max(...DASHBOARD_STATS.weekly_calls.map(w => w.count));

export default function Dashboard() {
  const recentSessions = [...CALL_SESSIONS].slice(0, 10);
  return (
    <Layout title="Dashboard">
      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon indigo"><Users size={22} /></div>
          <div>
            <div className="stat-label">Jami qarzdorlar</div>
            <div className="stat-value">{DASHBOARD_STATS.total_debtors}</div>
            <div className="stat-sub">Tizimda ro'yxatga olingan</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Phone size={22} /></div>
          <div>
            <div className="stat-label">Bugungi qo'ng'iroqlar</div>
            <div className="stat-value">{DASHBOARD_STATS.today_calls}</div>
            <div className="stat-sub">Bugun amalga oshirildi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rose"><TrendingDown size={22} /></div>
          <div>
            <div className="stat-label">Umumiy qarz</div>
            <div className="stat-value" style={{ fontSize: 16 }}>{fmtMoney(DASHBOARD_STATS.total_debt_sum)}</div>
            <div className="stat-sub">Barcha qarzdorlar bo'yicha</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Wallet size={22} /></div>
          <div>
            <div className="stat-label">Bugun to'langan</div>
            <div className="stat-value" style={{ fontSize: 16 }}>{fmtMoney(DASHBOARD_STATS.paid_today)}</div>
            <div className="stat-sub">Bugungi tushumlar</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 24 }}>
        {/* Weekly chart */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Haftalik qo'ng'iroqlar</div>
          <div className="chart-bars">
            {DASHBOARD_STATS.weekly_calls.map(w => (
              <div className="chart-bar-wrap" key={w.day}>
                <div className="chart-bar-val">{w.count}</div>
                <div
                  className="chart-bar"
                  style={{ height: `${(w.count / maxCalls) * 85}%` }}
                  data-tooltip={`${w.day}: ${w.count} ta`}
                />
                <div className="chart-bar-label">{w.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Tezkor statistika</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: "Yuqori xavfli", val: 18, color: 'var(--danger)', pct: 36 },
              { label: "O'rta xavfli", val: 22, color: 'var(--warning)', pct: 44 },
              { label: "Past xavfli", val: 10, color: 'var(--success)', pct: 20 },
            ].map(row => (
              <div key={row.label} className="report-bar-row">
                <div className="report-bar-label">{row.label}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
                <div className="report-bar-val">{row.val}</div>
              </div>
            ))}
            <div className="divider" />
            {[
              { label: "Muloqot tugadi", val: 12, color: 'var(--success)', pct: 24 },
              { label: "Javob bermadi", val: 16, color: 'var(--warning)', pct: 32 },
              { label: "Holati yo'q", val: 22, color: 'var(--text-muted)', pct: 44 },
            ].map(row => (
              <div key={row.label} className="report-bar-row">
                <div className="report-bar-label">{row.label}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
                <div className="report-bar-val">{row.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="section-title">So'nggi qo'ng'iroqlar</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sana</th>
              <th>Operator</th>
              <th>Qarzdor</th>
              <th>Telefon</th>
              <th>Davomiyligi</th>
              <th>Natija</th>
              <th>To'lov</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map(s => (
              <tr key={s.id}>
                <td className="muted">{fmtDate(s.date)}</td>
                <td>{s.operator_name}</td>
                <td style={{ fontWeight: 600 }}>{s.debtor_name}</td>
                <td className="muted">{s.phone}</td>
                <td className="muted">{fmtDuration(s.duration)}</td>
                <td>
                  <span className={`badge ${s.result === 'To\'lov' ? 'badge-green' : s.result === 'Muloqot' ? 'badge-indigo' : 'badge-gray'}`}>
                    {s.result}
                  </span>
                </td>
                <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                  {s.paid_amount > 0 ? fmtMoney(s.paid_amount) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
