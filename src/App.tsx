import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Citizens from './pages/Citizens';
import CitizenDetail from './pages/CitizenDetail';
import CallCenter from './pages/CallCenter';
import Recordings from './pages/Recordings';
import Reports from './pages/Reports';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Kpi from './pages/Kpi';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/citizens" element={<Citizens />} />
        <Route path="/citizens/:id" element={<CitizenDetail />} />
        <Route path="/callcenter" element={<CallCenter />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/kpi" element={<Kpi />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
