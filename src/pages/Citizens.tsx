import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RiskBadge, MuloqotBadge, StatusBadge } from '../components/Badge';
import { DEBTORS } from '../data/mock';
import type { Debtor } from '../data/mock';
import { fmtMoney } from '../utils/format';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 15;
const REGIONS = ['Barchasi', ...Array.from(new Set(DEBTORS.map(d => d.region)))];
const RISKS = ['Barchasi', 'Past', "O'rta", 'Yuqori'];
const MULOQOTS = ['Barchasi', 'tugadi', 'qisman', 'javob_bermadi', 'null'];

export default function Citizens() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Barchasi');
  const [risk, setRisk] = useState('Barchasi');
  const [muloqot, setMuloqot] = useState('Barchasi');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [debtors, setDebtors] = useState<Debtor[]>(DEBTORS);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return debtors.filter(d => {
      if (q && !d.full_name.toLowerCase().includes(q) && !d.phone.includes(q) && !d.application_id.includes(q)) return false;
      if (region !== 'Barchasi' && d.region !== region) return false;
      if (risk !== 'Barchasi' && d.risk_level !== risk) return false;
      if (muloqot !== 'Barchasi') {
        if (muloqot === 'null' && d.muloqot_status !== null) return false;
        if (muloqot !== 'null' && d.muloqot_status !== muloqot) return false;
      }
      return true;
    });
  }, [debtors, search, region, risk, muloqot]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectAll = () =>
    setSelected(paginated.length === paginated.filter(d => selected.includes(d.id)).length
      ? selected.filter(id => !paginated.find(d => d.id === id))
      : [...new Set([...selected, ...paginated.map(d => d.id)])]);

  const deleteSelected = () => {
    setDebtors(prev => prev.filter(d => !selected.includes(d.id)));
    setSelected([]);
  };

  return (
    <Layout title="Fuqarolar">
      <div className="page-header">
        <div>
          <div className="page-title">Qarzdorlar ro'yxati</div>
          <div className="page-sub">{filtered.length} ta yozuv topildi</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {selected.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={deleteSelected}>
              <Trash2 size={14} /> {selected.length} ta o'chirish
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="input-group" style={{ flex: 1, minWidth: 240 }}>
          <Search size={15} className="input-icon" />
          <input className="input" placeholder="Ism, telefon yoki ID bo'yicha qidirish..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input" style={{ width: 160 }} value={region} onChange={e => { setRegion(e.target.value); setPage(1); }}>
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="input" style={{ width: 140 }} value={risk} onChange={e => { setRisk(e.target.value); setPage(1); }}>
          {RISKS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="input" style={{ width: 170 }} value={muloqot} onChange={e => { setMuloqot(e.target.value); setPage(1); }}>
          {MULOQOTS.map(m => <option key={m} value={m}>{m === 'null' ? 'Belgilanmagan' : m === 'Barchasi' ? 'Barcha muloqot' : m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" className="cb" onChange={selectAll} checked={paginated.length > 0 && paginated.every(d => selected.includes(d.id))} /></th>
              <th>FIO</th>
              <th>ID Raqam</th>
              <th>Telefon</th>
              <th>Qarz</th>
              <th>Qoldiq</th>
              <th>Muddat (kun)</th>
              <th>Xavf</th>
              <th>Muloqot</th>
              <th>Holat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={11}><div className="empty-state"><p>Hech narsa topilmadi</p></div></td></tr>
            ) : paginated.map(d => (
              <tr key={d.id}>
                <td><input type="checkbox" className="cb" checked={selected.includes(d.id)} onChange={() => toggleSelect(d.id)} /></td>
                <td style={{ fontWeight: 600 }}>{d.full_name}</td>
                <td className="muted">{d.application_id}</td>
                <td className="muted">{d.phone}</td>
                <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{fmtMoney(d.debt_amount)}</td>
                <td>{fmtMoney(d.balance)}</td>
                <td>
                  <span style={{ color: d.overdue_days > 90 ? 'var(--danger)' : d.overdue_days > 30 ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>
                    {d.overdue_days}
                  </span>
                </td>
                <td><RiskBadge level={d.risk_level} /></td>
                <td><MuloqotBadge status={d.muloqot_status} /></td>
                <td><StatusBadge status={d.status} /></td>
                <td>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => navigate(`/citizens/${d.id}`)} data-tooltip="Ko'rish">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} ta
          </span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
            })}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
