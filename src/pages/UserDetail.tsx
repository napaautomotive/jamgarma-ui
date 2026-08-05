import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { USERS } from '../data/mock';
import { ArrowLeft, Pencil, Check, X, Mail, Phone, MapPin, Hash } from 'lucide-react';

const ROLES = ['Operator', 'Supervisor', 'Admin'];
const REGIONS = ['Toshkent', "Samarqand", "Farg'ona", 'Andijon', 'Namangan', 'Buxoro', 'Barcha'];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = USERS.find(u => u.id === Number(id));

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Operator',
    region: user?.region || 'Toshkent',
    extension: user?.extension || '',
  });

  if (!user) return (
    <Layout title="Topilmadi">
      <div className="empty-state"><p>Foydalanuvchi topilmadi</p></div>
    </Layout>
  );

  const cancelEdit = () => {
    setForm({ name: user.name, email: user.email, role: user.role, region: user.region, extension: user.extension });
    setEditing(false);
  };

  const roleBadge = (role: string) =>
    role === 'Admin' ? 'badge-red' : role === 'Supervisor' ? 'badge-indigo' : 'badge-gray';

  return (
    <Layout title="Foydalanuvchi ma'lumotlari">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="back-btn" onClick={() => navigate('/users')}>
          <ArrowLeft size={15} /> Orqaga
        </button>
        {!editing ? (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Tahrirlash
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}><X size={14} /> Bekor</button>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(false)}><Check size={14} /> Saqlash</button>
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="card card-lg" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
            {form.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input className="input" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            ) : (
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{form.name}</h2>
            )}
            <span className={`badge ${roleBadge(form.role)}`}>{form.role}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Extension</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-light)' }}>#{form.extension}</div>
          </div>
        </div>

        {editing ? (
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Email</div>
              <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="detail-item">
              <div className="detail-label">Extension</div>
              <input className="input" value={form.extension} onChange={e => setForm(p => ({ ...p, extension: e.target.value }))} />
            </div>
            <div className="detail-item">
              <div className="detail-label">Rol</div>
              <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="detail-item">
              <div className="detail-label">Viloyat</div>
              <select className="input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="detail-grid">
            {[
              { label: 'Email', value: form.email, icon: <Mail size={13} /> },
              { label: 'Viloyat', value: form.region, icon: <MapPin size={13} /> },
              { label: 'Rol', value: form.role, icon: <Hash size={13} /> },
              { label: 'Extension', value: `#${form.extension}`, icon: <Phone size={13} /> },
            ].map(item => (
              <div className="detail-item" key={item.label}>
                <div className="detail-label">{item.label}</div>
                <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                  {item.value || '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon indigo" style={{ width: 44, height: 44 }}>📞</div>
          <div>
            <div className="stat-label">Jami qo'ng'iroqlar</div>
            <div className="stat-value">—</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ width: 44, height: 44 }}>✅</div>
          <div>
            <div className="stat-label">To'lovlar</div>
            <div className="stat-value">—</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber" style={{ width: 44, height: 44 }}>⏱</div>
          <div>
            <div className="stat-label">Jami vaqt</div>
            <div className="stat-value">—</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
