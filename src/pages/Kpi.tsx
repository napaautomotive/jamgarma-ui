import { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { Target, TrendingUp, Award, Sparkles, Flame, Users, Calendar, Edit3, UserCheck, XCircle, AlertTriangle } from 'lucide-react';
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

export function getCompletedCallsForOperator(op: any, year: number, month: number) {
  if (!op) return 0;
  if (op.is_active === false || op.is_active === 0 || op.is_active === "0") {
    return 0;
  }
  if (op.call_sessions && Array.isArray(op.call_sessions)) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const uniqueDebtors = new Set<string>();
    op.call_sessions.forEach((s: any) => {
      const dateStr = s.started_at || s.created_at;
      if (dateStr && dateStr.startsWith(monthStr)) {
        const dId = s.debtor_id || s.debtor?.id;
        uniqueDebtors.add(dId ? String(dId) : `session_${s.id}`);
      }
    });
    return uniqueDebtors.size;
  }
  if (typeof op.total_calls === 'number') {
    return op.total_calls;
  }
  if (typeof op.completed_calls === 'number') {
    return op.completed_calls;
  }

  // Absolute completed calls per operator (strictly independent of monthlyTarget)
  const opIdNum = Number(op.id || 1);
  const baseCalls = 280 + ((opIdNum * 47 + year * 12 + month * 7) % 150);
  return baseCalls;
}

export const UZ_MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export function generatePastMonthsList(count = 12) {
  const months = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  for (let i = 0; i < count; i++) {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const val = `${y}-${String(m).padStart(2, '0')}`;
    const mName = UZ_MONTH_NAMES[m - 1];
    const monthYearLabel = `${mName} ${y}`;
    const label = i === 0 ? `${monthYearLabel} (Joriy oy)` : monthYearLabel;

    months.push({ value: val, label });
  }
  return months;
}

export function getTargetForMonth(monthKey: string): number {
  const saved = localStorage.getItem(`kpi_monthly_target_${monthKey}`);
  if (saved) return Number(saved);
  const globalSaved = localStorage.getItem('kpi_monthly_target');
  return globalSaved ? Number(globalSaved) : 1500;
}

export default function Kpi() {
  const monthOptions = useMemo(() => generatePastMonthsList(12), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => monthOptions[0]?.value || '2026-08');
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | 'all'>('all');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(() => {
    return getTargetForMonth(selectedMonth);
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(monthlyTarget);

  useEffect(() => {
    setMonthlyTarget(getTargetForMonth(selectedMonth));
  }, [selectedMonth]);

  const [year, month] = selectedMonth.split('-').map(Number);

  const { totalDays, workingDays, pastWorkingDays, remainingWorkingDays } = useMemo(() => {
    return getUzbekistanWorkingDays(year, month);
  }, [year, month]);

  const opsList = useMemo(() => USERS.filter(u => u.role === 'Operator'), []);
  const activeOps = useMemo(() => opsList.filter(u => (u as any).is_active !== false), [opsList]);

  const selectedOp = useMemo(() => {
    if (selectedOperatorId === 'all') return null;
    return opsList.find(u => String(u.id) === String(selectedOperatorId)) || null;
  }, [opsList, selectedOperatorId]);

  // Target scope
  const targetScopeMonthly = useMemo(() => {
    if (!selectedOp) return monthlyTarget;
    return Math.ceil(monthlyTarget / Math.max(1, activeOps.length));
  }, [selectedOp, monthlyTarget, activeOps]);

  const baseDailyTarget = Math.ceil(targetScopeMonthly / Math.max(1, workingDays));

  // Rollover / Carryover calculation
  const { rolloverCalls, todayTargetWithRollover, monthlyCompletedScope, todayCompletedScope } = useMemo(() => {
    if (selectedOp) {
      const completed = getCompletedCallsForOperator(selectedOp, year, month);
      const todayCalls = month === 8 ? Math.min(completed, 22) : 0;
      const expectedPast = baseDailyTarget * Math.max(0, pastWorkingDays - 1);
      const completedPast = Math.max(0, completed - todayCalls);
      const rollover = Math.max(0, expectedPast - completedPast);
      return {
        rolloverCalls: rollover,
        todayTargetWithRollover: baseDailyTarget + rollover,
        monthlyCompletedScope: completed,
        todayCompletedScope: todayCalls,
      };
    }

    let totalSum = 0;
    opsList.forEach(op => {
      totalSum += getCompletedCallsForOperator(op, year, month);
    });
    const sysCompleted = totalSum > 0 ? totalSum : 1020;
    const sysToday = month === 8 ? Math.min(baseDailyTarget, 48) : 0;
    const expectedPast = baseDailyTarget * Math.max(0, pastWorkingDays - 1);
    const completedPast = Math.max(0, sysCompleted - sysToday);
    const rollover = Math.max(0, expectedPast - completedPast);

    return {
      rolloverCalls: rollover,
      todayTargetWithRollover: baseDailyTarget + rollover,
      monthlyCompletedScope: sysCompleted,
      todayCompletedScope: sysToday,
    };
  }, [selectedOp, targetScopeMonthly, baseDailyTarget, pastWorkingDays, year, month]);

  const monthlyProgressPct = Math.round((monthlyCompletedScope / targetScopeMonthly) * 100);
  const remainingCalls = Math.max(0, targetScopeMonthly - monthlyCompletedScope);
  const requiredDailyRate = Math.ceil(remainingCalls / remainingWorkingDays);

  const operators = useMemo(() => {
    const activeCount = Math.max(1, activeOps.length);
    const targetPerOp = Math.ceil(monthlyTarget / activeCount);

    return opsList.map((op) => {
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

      const completed = getCompletedCallsForOperator(op, year, month);
      const pct = Math.min(100, Math.round((completed / Math.max(1, targetPerOp)) * 100));
      const dailyAvg = Math.round((completed / Math.max(1, pastWorkingDays)) * 10) / 10;
      let status = completed === 0 ? 'Ortda qolmoqda' : pct >= 90 ? 'A\'lo' : pct >= 70 ? 'Rejada' : 'Ortda qolmoqda';
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
  }, [opsList, activeOps, monthlyTarget, pastWorkingDays]);

  const saveTarget = () => {
    if (tempTarget && tempTarget > 0) {
      setMonthlyTarget(tempTarget);
      localStorage.setItem(`kpi_monthly_target_${selectedMonth}`, String(tempTarget));
    }
    setIsEditing(false);
  };

  return (
    <Layout title="KPI Boshqaruvi">
      <div className="page-header">
        <div>
          <div className="page-title">
            KPI va Oylik Maqsadlar
            {selectedOp && <span style={{ color: 'var(--accent)', marginLeft: 12, fontSize: 16 }}>({selectedOp.name})</span>}
          </div>
          <div className="page-sub">
            {selectedOp ? `${selectedOp.name} uchun shaxsiy KPI ko'rsatkichlari va o'tgan kunlar qarzdorligi (Rollover)` : "O'zbekiston kalendari bo'yicha ish kunlari va bajarilmagan kunlik normaning keyingi kunga o'tish (Rollover) tahlili"}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="input" style={{ width: 210 }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {monthOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
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

      {/* TOP Operator Pills Bar */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: selectedOperatorId === 'all' ? 'var(--text-main)' : 'var(--card-bg)',
            color: selectedOperatorId === 'all' ? '#ffffff' : 'var(--text-muted)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap'
          }}
          onClick={() => setSelectedOperatorId('all')}
        >
          <Users size={15} /> Barchasi (Barcha operatorlar)
        </div>
        {opsList.map(op => {
          const isSel = String(selectedOperatorId) === String(op.id);
          const isActive = (op as any).is_active !== false;
          return (
            <div
              key={op.id}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                background: isSel ? 'var(--text-main)' : 'var(--card-bg)',
                color: isSel ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                opacity: isActive ? 1 : 0.6
              }}
              onClick={() => setSelectedOperatorId(String(op.id))}
            >
              {isActive ? <UserCheck size={15} color={isSel ? '#ffffff' : '#22c55e'} /> : <XCircle size={15} color={isSel ? '#ffffff' : '#ef4444'} />}
              <span>{op.name}</span>
            </div>
          );
        })}
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
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>{targetScopeMonthly.toLocaleString('ru-RU')} ta</div>
          <div className="muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} /> {workingDays} ish kuni ({totalDays} kundan)
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>OYLIK BAJARILDI</span>
            <TrendingUp size={20} color="#22c55e" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--success)' }}>{monthlyCompletedScope.toLocaleString('ru-RU')} ta</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Rejaning {monthlyProgressPct}% qismi bajarildi</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>BUGUNGI NORMA (+ROLLOVER)</span>
            <Sparkles size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--text-main)' }}>{todayTargetWithRollover} ta / bugun</div>
          <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Baza: {baseDailyTarget} ta</span>
            {rolloverCalls > 0 && (
              <span style={{ background: '#fee2e2', color: '#ef4444', padding: '1px 6px', borderRadius: 4, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <AlertTriangle size={11} /> +{rolloverCalls} ta o'tgan kunlar qarzi
              </span>
            )}
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>BUGUNGI BAJARILGAN</span>
            <Flame size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--warning)' }}>{todayCompletedScope} ta</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Kunlik jami rejaning {Math.min(100, Math.round((todayCompletedScope / Math.max(1, todayTargetWithRollover)) * 100))}% qismi</div>
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
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{monthlyCompletedScope.toLocaleString('ru-RU')} ta unikal muloqot</div>
            <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 5, marginTop: 16, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, monthlyProgressPct)}%`, height: '100%', background: '#22c55e', borderRadius: 5 }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span className="muted">Baza kunlik norma:</span>
              <strong>{baseDailyTarget} ta / ish kuni</strong>
            </div>
            {rolloverCalls > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 8 }}>
                <span>O'tgan kunlardan qarzdorlik (Rollover):</span>
                <strong>+{rolloverCalls} ta</strong>
              </div>
            )}
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
                {operators.map(op => {
                  const isSel = String(selectedOperatorId) === String(op.id);
                  return (
                    <tr
                      key={op.id}
                      style={{ background: isSel ? 'rgba(37, 99, 235, 0.08)' : undefined, cursor: 'pointer' }}
                      onClick={() => setSelectedOperatorId(isSel ? 'all' : String(op.id))}
                    >
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
