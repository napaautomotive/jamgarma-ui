import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Target, TrendingUp, Award, Sparkles, Flame, Users } from 'lucide-react';
import { USERS } from '../data/mock';

const MONTHLY_TARGET = 1500;

export default function Kpi() {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  // Days calculations
  const daysInMonth = 31;
  const currentDay = 11;
  const remainingDays = daysInMonth - currentDay;
  const dailyTarget = Math.ceil(MONTHLY_TARGET / daysInMonth); // 49 calls/day

  // Completed calls
  const monthlyCompleted = 1184;
  const todayCompleted = 48;
  const monthlyProgressPct = Math.round((monthlyCompleted / MONTHLY_TARGET) * 100);
  const remainingCalls = MONTHLY_TARGET - monthlyCompleted;
  const requiredDailyRate = Math.ceil(remainingCalls / remainingDays);

  const operators = useMemo(() => {
    const ops = USERS.filter(u => u.role === 'Operator');
    const count = ops.length || 4;
    const targetPerOp = Math.ceil(MONTHLY_TARGET / count);

    return ops.map((op, idx) => {
      const completed = 360 - idx * 42;
      const pct = Math.min(100, Math.round((completed / targetPerOp) * 100));
      const dailyAvg = Math.round((completed / currentDay) * 10) / 10;
      let status = pct >= 90 ? 'A\'lo' : pct >= 70 ? 'Rejada' : 'Ortda qolmoqda';
      return {
        ...op,
        target: targetPerOp,
        completed,
        pct,
        dailyAvg,
        status
      };
    });
  }, []);

  return (
    <Layout title="KPI Boshqaruvi">
      <div className="page-header">
        <div>
          <div className="page-title">KPI va Oylik Maqsadlar</div>
          <div className="page-sub">Oylik 1 500 ta qo'ng'iroq maqsadi va operatorlar ko'rsatkichlari</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="input" style={{ width: 160 }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="2026-08">Avgust 2026</option>
            <option value="2026-07">Iyul 2026</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>OYLIK REJA MAQSADI</span>
            <Target size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>1 500 ta</div>
          <div className="muted" style={{ fontSize: 12 }}>Avgust oyi uchun umumiy maqsad</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>OYLIK BAJARILDI</span>
            <TrendingUp size={20} color="#22c55e" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--success)' }}>1 184 ta</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Rejaning {monthlyProgressPct}% qismi bajarildi</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>KUNLIK AVTO-REJA</span>
            <Sparkles size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>{dailyTarget} ta / kun</div>
          <div className="muted" style={{ fontSize: 12 }}>1500 ta / 31 kun bo'linishi</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>BUGUNGI BAJARILGAN</span>
            <Flame size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--warning)' }}>{todayCompleted} ta</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Kunlik norma 98% bajarildi</div>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="#2563eb" />
            Oylik Reja Progressi
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--text-main)' }}>{monthlyProgressPct}%</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>1 184 / 1 500 ta qo'ng'iroq</div>
            <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 5, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ width: `${monthlyProgressPct}%`, height: '100%', background: '#22c55e', borderRadius: 5 }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Qolgan qo'ng'iroqlar:</span>
              <strong style={{ color: 'var(--danger)' }}>{remainingCalls} ta</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Qolgan kunlar:</span>
              <strong>{remainingDays} kun</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Kerakli kunlik norma:</span>
              <strong style={{ color: 'var(--accent)' }}>{requiredDailyRate} ta / kun</strong>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#22c55e" />
            Operatorlar Bajarilish Ko'rsatkichi
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Reja</th>
                  <th>Bajarildi</th>
                  <th>Progress</th>
                  <th>Kunlik avt.</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {operators.map(op => (
                  <tr key={op.id}>
                    <td style={{ fontWeight: 600 }}>{op.name}</td>
                    <td>{op.target} ta</td>
                    <td><strong style={{ color: 'var(--success)' }}>{op.completed} ta</strong></td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{op.pct}%</div>
                      <div style={{ height: 6, width: '100%', background: '#e2e8f0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${op.pct}%`, height: '100%', background: op.pct >= 90 ? '#22c55e' : '#3b82f6' }} />
                      </div>
                    </td>
                    <td>{op.dailyAvg} ta/kun</td>
                    <td>
                      <span className={`badge ${op.status === "A'lo" ? 'badge-green' : op.status === 'Rejada' ? 'badge-indigo' : 'badge-amber'}`}>
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
