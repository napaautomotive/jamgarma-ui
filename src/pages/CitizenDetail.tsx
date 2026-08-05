import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RiskBadge, MuloqotBadge } from '../components/Badge';
import { DEBTORS, CALL_SESSIONS } from '../data/mock';
import type { MuloqotStatus } from '../data/mock';
import { fmtMoney, fmtDuration, fmtDate } from '../utils/format';
import { ArrowLeft, Phone, User, MapPin, Calendar, Pencil, Check, X } from 'lucide-react';

export default function CitizenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const debtor = DEBTORS.find(d => d.id === Number(id));
  const [notes, setNotes] = useState(debtor?.notes || '');
  const [muloqot, setMuloqot] = useState<MuloqotStatus>(debtor?.muloqot_status || null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: debtor?.full_name || '',
    phone: debtor?.phone || '',
    pinfl: debtor?.pinfl || '',
    region: debtor?.region || '',
    district: debtor?.district || '',
    mahalla: debtor?.mahalla || '',
    assistant_name: debtor?.assistant_name || '',
    assistant_phone: debtor?.assistant_phone || '',
    allocation_date: debtor?.allocation_date || '',
  });
  const sessions = CALL_SESSIONS.filter(s => s.debtor_id === Number(id));

  if (!debtor) return (
    <Layout title="Topilmadi">
      <div className="empty-state"><p>Qarzdor topilmadi</p></div>
    </Layout>
  );

  const saveEdit = () => setEditing(false);
  const cancelEdit = () => { setForm({ full_name: debtor.full_name, phone: debtor.phone, pinfl: debtor.pinfl, region: debtor.region, district: debtor.district, mahalla: debtor.mahalla, assistant_name: debtor.assistant_name, assistant_phone: debtor.assistant_phone, allocation_date: debtor.allocation_date }); setEditing(false); };

  return (
    <Layout title="Qarzdor ma'lumotlari">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="back-btn" onClick={() => navigate('/citizens')}>
          <ArrowLeft size={15} /> Orqaga
        </button>
        {!editing ? (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Tahrirlash
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}><X size={14} /> Bekor</button>
            <button className="btn btn-primary btn-sm" onClick={saveEdit}><Check size={14} /> Saqlash</button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="card card-lg" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
            {(form.full_name || debtor.full_name).split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input className="input" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }} value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{form.full_name}</h2>
                <RiskBadge level={debtor.risk_level} />
                <MuloqotBadge status={muloqot} />
              </div>
            )}
            {!editing && (
              <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 5, alignItems: 'center' }}><Phone size={13} />{form.phone}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 5, alignItems: 'center' }}><User size={13} />PINFL: {form.pinfl}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 5, alignItems: 'center' }}><MapPin size={13} />{form.region}, {form.district}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 5, alignItems: 'center' }}><Calendar size={13} />{form.allocation_date}</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ID Raqam</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-light)' }}>{debtor.application_id}</div>
          </div>
        </div>

        {editing ? (
          <div className="detail-grid">
            {[
              { label: 'Telefon', key: 'phone' },
              { label: 'PINFL', key: 'pinfl' },
              { label: 'Viloyat', key: 'region' },
              { label: 'Tuman', key: 'district' },
              { label: 'MFY', key: 'mahalla' },
              { label: 'Ajratilgan sana', key: 'allocation_date' },
              { label: 'Yordamchi', key: 'assistant_name' },
              { label: 'Yordamchi tel.', key: 'assistant_phone' },
            ].map(f => (
              <div className="detail-item" key={f.key}>
                <div className="detail-label">{f.label}</div>
                <input className="input" value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        ) : (
          <div className="detail-grid">
            {[
              { label: 'Viloyat', value: form.region },
              { label: 'Tuman', value: form.district },
              { label: 'MFY', value: form.mahalla },
              { label: 'Ajratilgan sana', value: form.allocation_date },
              { label: 'Yordamchi', value: form.assistant_name },
              { label: 'Yordamchi tel.', value: form.assistant_phone },
            ].map(item => (
              <div className="detail-item" key={item.label}>
                <div className="detail-label">{item.label}</div>
                <div className="detail-value">{item.value || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial cards */}
      <div className="fin-grid">
        <div className="fin-card"><div className="fin-card-label">Umumiy qarz</div><div className="fin-card-value danger">{fmtMoney(debtor.debt_amount)}</div></div>
        <div className="fin-card"><div className="fin-card-label">Qoldiq</div><div className="fin-card-value accent">{fmtMoney(debtor.balance)}</div></div>
        <div className="fin-card"><div className="fin-card-label">To'langan</div><div className="fin-card-value success">{fmtMoney(debtor.paid_amount)}</div></div>
        <div className="fin-card"><div className="fin-card-label">Oylik to'lov</div><div className="fin-card-value">{fmtMoney(debtor.monthly_payment)}</div></div>
        <div className="fin-card"><div className="fin-card-label">Muddati o'tgan qarz</div><div className="fin-card-value danger">{fmtMoney(debtor.overdue_debt)}</div></div>
        <div className="fin-card"><div className="fin-card-label">Muddati o'tgan kun</div><div className="fin-card-value warning">{debtor.overdue_days} kun</div></div>
      </div>

      {/* Muloqot & Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Muloqot holati</div>
          <div className="muloqot-btns">
            {(['tugadi', 'qisman', 'javob_bermadi'] as MuloqotStatus[]).map(m => (
              <button key={m!} className={`muloqot-btn ${muloqot === m ? `active-${m === 'javob_bermadi' ? 'javob' : m}` : ''}`} onClick={() => setMuloqot(m)}>
                {m === 'tugadi' ? 'Tugadi' : m === 'qisman' ? 'Qisman' : 'Javob bermadi'}
              </button>
            ))}
            {muloqot && <button className="muloqot-btn" onClick={() => setMuloqot(null)}>Tozalash</button>}
          </div>
        </div>
        <div className="card">
          <div className="section-title">Izohlar</div>
          <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Izoh yozing..." style={{ minHeight: 64 }} />
        </div>
      </div>

      {/* Call history */}
      <div className="section-title">Qo'ng'iroqlar tarixi ({sessions.length})</div>
      {sessions.length === 0 ? (
        <div className="card"><div className="empty-state"><p>Qo'ng'iroqlar tarixi yo'q</p></div></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sana</th>
                <th>Operator</th>
                <th>Davomiyligi</th>
                <th>Natija</th>
                <th>Kategoriya</th>
                <th>To'lov</th>
                <th>Izoh</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td className="muted">{fmtDate(s.date)}</td>
                  <td>{s.operator_name}</td>
                  <td className="muted">{fmtDuration(s.duration)}</td>
                  <td><span className={`badge ${s.result === "To'lov" ? 'badge-green' : s.result === 'Muloqot' ? 'badge-indigo' : 'badge-gray'}`}>{s.result}</span></td>
                  <td className="muted">{s.category}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>{s.paid_amount > 0 ? fmtMoney(s.paid_amount) : '—'}</td>
                  <td className="muted">{s.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
