import Layout from '../components/Layout';
import { CALL_SESSIONS, DASHBOARD_STATS } from '../data/mock';
import { fmtMoney } from '../utils/format';

const operators = Array.from(new Set(CALL_SESSIONS.map(s => s.operator_name)));

const stats = operators.map(op => {
  const sessions = CALL_SESSIONS.filter(s => s.operator_name === op);
  const paid = sessions.filter(s => s.result === "To'lov");
  const totalDuration = sessions.reduce((a, s) => a + s.duration, 0);
  const totalPaid = paid.reduce((a, s) => a + s.paid_amount, 0);
  return { op, total: sessions.length, paid: paid.length, totalDuration, totalPaid };
});

const maxCalls = Math.max(...stats.map(s => s.total));

export default function Reports() {
  return (
    <Layout title="Hisobotlar">
      <div className="page-header">
        <div>
          <div className="page-title">Hisobotlar</div>
          <div className="page-sub">Operatorlar bo'yicha statistika</div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon green" style={{ width: 44, height: 44 }}>📞</div>
          <div>
            <div className="stat-label">Jami qo'ng'iroqlar</div>
            <div className="stat-value">{CALL_SESSIONS.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo" style={{ width: 44, height: 44 }}>💳</div>
          <div>
            <div className="stat-label">To'lov qilingan seanslari</div>
            <div className="stat-value">{CALL_SESSIONS.filter(s => s.result === "To'lov").length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rose" style={{ width: 44, height: 44 }}>💰</div>
          <div>
            <div className="stat-label">Jami tushumlar</div>
            <div className="stat-value" style={{ fontSize: 15 }}>{fmtMoney(CALL_SESSIONS.reduce((a,s)=>a+s.paid_amount,0))}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber" style={{ width: 44, height: 44 }}>👥</div>
          <div>
            <div className="stat-label">Faol operatorlar</div>
            <div className="stat-value">{operators.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Per-operator table */}
        <div>
          <div className="section-title">Operator bo'yicha natijalar</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Qo'ng'iroqlar</th>
                  <th>To'lovlar</th>
                  <th>Tushum</th>
                </tr>
              </thead>
              <tbody>
                {stats.sort((a,b) => b.total - a.total).map(s => (
                  <tr key={s.op}>
                    <td style={{ fontWeight: 600 }}>{s.op}</td>
                    <td>{s.total}</td>
                    <td><span className="badge badge-green">{s.paid}</span></td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{fmtMoney(s.totalPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operator bar chart */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Qo'ng'iroqlar ko'rsatkichi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.sort((a,b) => b.total - a.total).map(s => (
              <div key={s.op} className="report-bar-row">
                <div className="report-bar-label" style={{ minWidth: 150 }}>{s.op.split(' ')[0]}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{ width: `${(s.total / maxCalls) * 100}%` }} />
                </div>
                <div className="report-bar-val">{s.total}</div>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="section-title" style={{ marginBottom: 16 }}>Haftalik faollik</div>
          <div className="chart-bars" style={{ height: 100 }}>
            {DASHBOARD_STATS.weekly_calls.map(w => {
              const maxW = Math.max(...DASHBOARD_STATS.weekly_calls.map(x=>x.count));
              return (
                <div className="chart-bar-wrap" key={w.day}>
                  <div className="chart-bar-val">{w.count}</div>
                  <div className="chart-bar" style={{ height: `${(w.count/maxW)*85}%` }} />
                  <div className="chart-bar-label">{w.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
