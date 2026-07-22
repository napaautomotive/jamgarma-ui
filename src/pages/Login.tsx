import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(99,102,241,0.25) 0%, #0a0f1e 60%)' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>QarzCRM</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Qarz boshqaruvi tizimiga xush kelibsiz</div>
        </div>

        <div className="card card-lg" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" placeholder="admin@jamgarma.uz" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && navigate('/')} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }} onClick={() => navigate('/')}>
            Kirish
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          Demo: admin@jamgarma.uz / ixtiyoriy parol
        </div>
      </div>
    </div>
  );
}
