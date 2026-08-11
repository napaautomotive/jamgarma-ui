import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Target, TrendingUp, Award, Sparkles, Flame, Users, Calendar, Edit3 } from 'lucide-react';
import { USERS } from '../data/mock';

export function getUzbekistanWorkingDays(year: number, month: number) {
  const totalDays = new Date(year, month, 0).getDate();
  let workingDays = 0;
  let pastWorkingDays = 0;
  const today = new Date();

  const fixedHolidays = new Set([
    '1-1', '3-8', '3-21', '5-9', '9-1', '10-1', '12-8',
  ]);

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month - 1, day);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = fixedHolidays.has(`${month}-${day}`);

    if (!isWeekend && !isHoliday) {
      workingDays++;
      if (
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth() + 1) ||
        (year === today.getFullYear() && month === today.getMonth() + 1 && day <= today.getDate())
      ) {
        pastWorkingDays++;
      }
    }
  }

  const remainingWorkingDays = Math.max(1, workingDays - pastWorkingDays);

  return {
    totalDays,
    workingDays,
    pastWorkingDays,
    remainingWorkingDays,
  };
}

export default function Kpi() {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(() => {
    const saved = localStorage.getItem('kpi_monthly_target');
    return saved ? Number(saved) : 1500;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(monthlyTarget);

  const [year, month] = selectedMonth.split('-').map(Number);

  const { totalDays, workingDays, pastWorkingDays, remainingWorkingDays } = useMemo(() => {
    return getUzbekistanWorkingDays(year, month);
  }, [year, month]);

  const dailyTarget = Math.ceil(monthlyTarget / Math.max(1, workingDays));

  // Filtered stats by month
  const monthlyCompleted = useMemo(() => {
    const seed = (year * 12 + month) % 5;
    return Math.round(monthlyTarget * (0.75 + seed * 0.04));
  }, [year, month, monthlyTarget]);

  const todayCompleted = Math.min(dailyTarget, 48);
  const monthlyProgressPct = Math.round((monthlyCompleted / monthlyTarget) * 100);
  const remainingCalls = Math.max(0, monthlyTarget - monthlyCompleted);
  const requiredDailyRate = Math.ceil(remainingCalls / remainingWorkingDays);

  const operators = useMemo(() => {
    const ops = USERS.filter(u => u.role === 'Operator');
    const activeOps = ops.filter(u => (u as any).is_active !== false);
    const activeCount = Math.max(1, activeOps.length);
    const targetPerOp = Math.ceil(monthlyTarget / activeCount);

    return ops.map((op, idx) => {
      const isActive = (op as any).is_active !== false;

      if (!isActive) {
        return {
          ...op,
          target: 0,
          completed: 0,
          pct: 0,
          dailyAvg: 0,
          status: 'Nofaol',
          isActive: false
        };
      }

      const completed = Math.round(targetPerOp * 0.85) - idx * 25;
      const pct = Math.min(100, Math.round((completed / targetPerOp) * 100));
      const dailyAvg = Math.round((completed / Math.max(1, pastWorkingDays)) * 10) / 10;
      let status = pct >= 90 ? 'A\'lo' : pct >= 70 ? 'Rejada' : 'Ortda qolmoqda';
      return {
        ...op,
        target: targetPerOp,
        completed,
        pct,
        dailyAvg,
        status,
        isActive: true
      };
    });
  }, [monthlyTarget, pastWorkingDays]);

  const saveTarget = () => {
    if (tempTarget && tempTarget > 0) {
      setMonthlyTarget(tempTarget);
      localStorage.setItem('kpi_monthly_target', String(tempTarget));
    }
    setIsEditing(false);
  };

  return (
    <Layout title="KPI Boshqaruvi">
      <div className="page-header">
        <div>
          <div className="page-title">KPI va Oylik Maqsadlar</div>
          <div className="page-sub">O'zbekiston kalendari bo'yicha ish kunlari va rasmiy bayramlar inobatga olingan kunlik avto-reja</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="input" style={{ width: 160 }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="2026-08">Avgust 2026</option>
            <option value="2026-09">Sentabr 2026</option>
            <option value="2026-07">Iyul 2026</option>
            <option value="2026-06">Iyun 2026</option>
          </select>
          <button
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setTempTarget(monthlyTarget); setIsEditing(true); }}
          >
            <Edit3 size={14} /> Rejani tahrirlash
          </button>
        </div>
      </div>

      {isEditing && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Yangi oylik maqsad (qo'ng'iroqlar soni):</label>
          <input
            type="number"
            className="input"
            style={{ width: 160 }}
            value={tempTarget}
            onChange={e => setTempTarget(Number(e.target.value))}
          />
          <button className="btn btn-primary" onClick={saveTarget}>Saqlash</button>
          <button className="btn" onClick={() => setIsEditing(false)}>Bekor qilish</button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>OYLIK REJA MAQSADI</span>
            <Target size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>{monthlyTarget.toLocaleString('ru-RU')} ta</div>
          <div className="muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} /> {workingDays} ish kuni ({totalDays} kundan)
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>OYLIK BAJARILDI</span>
            <TrendingUp size={20} color="#22c55e" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--success)' }}>{monthlyCompleted.toLocaleString('ru-RU')} ta</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Rejaning {monthlyProgressPct}% qismi bajarildi</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>KUNLIK AVTO-REJA</span>
            <Sparkles size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>{dailyTarget} ta / ish kuni</div>
          <div className="muted" style={{ fontSize: 12 }}>{monthlyTarget} ta / {workingDays} ish kuni</div>
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
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{monthlyCompleted.toLocaleString('ru-RU')} / {monthlyTarget.toLocaleString('ru-RU')} ta qo'ng'iroq</div>
            <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 5, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ width: `${monthlyProgressPct}%`, height: '100%', background: '#22c55e', borderRadius: 5 }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Jami ish kunlari:</span>
              <strong>{workingDays} kun</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Qolgan qo'ng'iroqlar:</span>
              <strong style={{ color: 'var(--danger)' }}>{remainingCalls.toLocaleString('ru-RU')} ta</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Qolgan ish kunlari:</span>
              <strong>{remainingWorkingDays} ish kuni</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Kerakli kunlik norma:</span>
              <strong style={{ color: 'var(--accent)' }}>{requiredDailyRate} ta / ish kuni</strong>
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
                    <td>{op.isActive ? `${op.target} ta` : '0 ta (Nofaol)'}</td>
                    <td><strong style={{ color: op.isActive ? 'var(--success)' : '#94a3b8' }}>{op.completed} ta</strong></td>
                    <td style={{ minWidth: 120 }}>
                      {op.isActive ? (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>{op.pct}%</div>
                          <div style={{ height: 6, width: '100%', background: '#e2e8f0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${op.pct}%`, height: '100%', background: op.pct >= 90 ? '#22c55e' : '#3b82f6' }} />
                          </div>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Hisoblanmaydi</span>
                      )}
                    </td>
                    <td>{op.isActive ? `${op.dailyAvg} ta/ish kuni` : '—'}</td>
                    <td>
                      <span className={`badge ${op.status === "A'lo" ? 'badge-green' : op.status === 'Rejada' ? 'badge-indigo' : op.status === 'Nofaol' ? 'badge-gray' : 'badge-amber'}`}>
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
