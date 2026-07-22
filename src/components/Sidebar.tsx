import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Phone, PlayCircle,
  BarChart3, UserCog, LogOut
} from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/citizens', icon: Users, label: 'Fuqarolar' },
  { to: '/callcenter', icon: Phone, label: 'Call Center' },
  { to: '/recordings', icon: PlayCircle, label: 'Yozuvlar' },
  { to: '/reports', icon: BarChart3, label: 'Hisobotlar' },
  { to: '/users', icon: UserCog, label: 'Foydalanuvchilar' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">QarzCRM</div>
        <div className="sidebar-logo-sub">Qarz boshqaruvi tizimi</div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Asosiy</div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="user-avatar">A</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-role">Bosh Admin</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => navigate('/login')}>
          <LogOut size={15} /> Chiqish
        </button>
      </div>
    </aside>
  );
}
