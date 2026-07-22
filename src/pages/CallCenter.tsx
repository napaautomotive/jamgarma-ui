import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { DEBTORS } from '../data/mock';
import type { Debtor } from '../data/mock';
import { fmtMoney } from '../utils/format';
import { Phone, PhoneOff, Mic, MicOff, Pause } from 'lucide-react';

const QUEUE = [...DEBTORS].sort((a, b) => b.overdue_days - a.overdue_days).slice(0, 20);

export default function CallCenter() {
  const [activeDebtor, setActiveDebtor] = useState<Debtor | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = (d: Debtor) => {
    setActiveDebtor(d);
    setElapsed(0);
    setMuted(false);
    setHeld(false);
  };

  const endCall = () => {
    setActiveDebtor(null);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (activeDebtor) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeDebtor]);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <Layout title="Call Center">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: 'calc(100vh - 140px)' }}>
        {/* Queue */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="section-title">Navbat ({QUEUE.length})</div>
          <div className="call-queue-list" style={{ flex: 1, overflowY: 'auto' }}>
            {QUEUE.map(d => (
              <div key={d.id} className="queue-item" style={{ borderColor: activeDebtor?.id === d.id ? 'var(--accent)' : undefined }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {d.full_name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                </div>
                <div className="queue-info">
                  <div className="queue-name">{d.full_name}</div>
                  <div className="queue-phone">{d.phone}</div>
                  <div className="queue-debt">{fmtMoney(d.overdue_debt)} · {d.overdue_days} kun</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => startCall(d)} style={{ flexShrink: 0 }}>
                  <Phone size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active call */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!activeDebtor ? (
            <div className="idle-state">
              <div className="idle-icon"><Phone size={52} /></div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Faol qo'ng'iroq yo'q</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Navbatdan biror qarzdorni tanlang</div>
            </div>
          ) : (
            <div className="active-call-card" style={{ border: 'none', background: 'transparent' }}>
              <div className="call-avatar">
                {activeDebtor.full_name.split(' ').slice(0,2).map(w=>w[0]).join('')}
              </div>
              <div>
                <div className="call-name">{activeDebtor.full_name}</div>
                <div className="call-phone">{activeDebtor.phone}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {activeDebtor.region} · {fmtMoney(activeDebtor.debt_amount)} qarz
                </div>
              </div>
              <div className="call-timer pulse">{fmt(elapsed)}</div>
              <div className="call-controls">
                <button className={`call-btn mute`} onClick={() => setMuted(m => !m)} data-tooltip={muted ? 'Unmute' : 'Mute'}>
                  {muted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button className={`call-btn end`} onClick={endCall} data-tooltip="Tugatish">
                  <PhoneOff size={22} />
                </button>
                <button className={`call-btn hold`} onClick={() => setHeld(h => !h)} data-tooltip={held ? 'Resume' : 'Hold'} style={{ background: held ? 'var(--warning-bg)' : undefined }}>
                  <Pause size={20} />
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {held ? '⏸ Kutishda...' : muted ? '🔇 Mikrofon o\'chirilgan' : '🟢 Faol'}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
