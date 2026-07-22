import { useState } from 'react';
import Layout from '../components/Layout';
import { USERS } from '../data/mock';
import type { User } from '../data/mock';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const ROLES = ['Operator', 'Supervisor', 'Admin'];
const REGIONS = ['Toshkent', "Samarqand", "Farg'ona", 'Andijon', 'Namangan', 'Buxoro', 'Barcha'];

export default function Users() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Operator', region: 'Toshkent', extension: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setForm({ name: '', email: '', role: 'Operator', region: 'Toshkent', extension: '' }); setEditing(null); setModal('create'); };
  const openEdit = (u: User) => { setForm({ name: u.name, email: u.email, role: u.role, region: u.region, extension: u.extension }); setEditing(u); setModal('edit'); };
  const closeModal = () => setModal(null);

  const save = () => {
    if (!form.name || !form.email) return;
    if (modal === 'create') {
      setUsers(prev => [...prev, { id: Date.now(), ...form }]);
    } else if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u));
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (deleteId) setUsers(prev => prev.filter(u => u.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <Layout title="Foydalanuvchilar">
      <div className="page-header">
        <div>
          <div className="page-title">Operatorlar ro'yxati</div>
          <div className="page-sub">{users.length} ta foydalanuvchi</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Qo'shish</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Viloyat</th>
              <th>Raqam</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td className="muted">{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {u.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td className="muted">{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'Admin' ? 'badge-red' : u.role === 'Supervisor' ? 'badge-indigo' : 'badge-gray'}`}>{u.role}</span>
                </td>
                <td className="muted">{u.region}</td>
                <td><span className="badge badge-indigo">#{u.extension}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(u)} data-tooltip="Tahrirlash"><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteId(u.id)} data-tooltip="O'chirish"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? "Yangi foydalanuvchi" : "Tahrirlash"}</div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Ism', key: 'name', type: 'text', placeholder: 'To\'liq ism' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@jamgarma.uz' },
                { label: 'Raqam (Extension)', key: 'extension', type: 'text', placeholder: '101' },
              ].map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Viloyat</label>
                <select className="input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Bekor qilish</button>
              <button className="btn btn-primary" onClick={save}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">O'chirishni tasdiqlang</div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>Ushbu foydalanuvchini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Bekor qilish</button>
              <button className="btn btn-danger" onClick={confirmDelete}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
