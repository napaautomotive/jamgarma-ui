import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { CALL_SESSIONS } from '../data/mock';
import { fmtMoney, fmtDuration, fmtDate } from '../utils/format';
import { Download } from 'lucide-react';

const OPERATORS = ['Barchasi', ...Array.from(new Set(CALL_SESSIONS.map(s => s.operator_name)))];

export default function Recordings() {
  const [operator, setOperator] = useState('Barchasi');

  const filtered = useMemo(() =>
    operator === 'Barchasi' ? CALL_SESSIONS : CALL_SESSIONS.filter(s => s.operator_name === operator),
    [operator]
  );

  const downloadExcel = () => {
    if (filtered.length === 0) return;

    const headers = [
      "№",
      "Sana",
      "Operator",
      "Qarzdor",
      "Telefon",
      "Davomiyligi (sek)",
      "Natija",
      "Kategoriya",
      "To'lov usuli",
      "To'langan (so'm)",
      "Izoh"
    ];

    const rows = filtered.map((s, idx) => [
      idx + 1,
      `"${fmtDate(s.date)}"`,
      `"${s.operator_name}"`,
      `"${s.debtor_name}"`,
      `"${s.phone}"`,
      `"${fmtDuration(s.duration)}"`,
      `"${s.result}"`,
      `"${s.category || '—'}"`,
      `"${s.payment_method || '—'}"`,
      `"${s.paid_amount || 0}"`,
      `"${(s.notes || '—').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeOpName = operator.replace(/[^a-zA-Z0-9_]/g, "_");
    a.download = `qongiroqlar_tarixi_${safeOpName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Yozuvlar">
      <div className="page-header">
        <div>
          <div className="page-title">Qo'ng'iroqlar tarixi</div>
          <div className="page-sub">{filtered.length} ta yozuv</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="input" style={{ width: 200 }} value={operator} onChange={e => setOperator(e.target.value)}>
            {OPERATORS.map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="btn btn-primary" onClick={downloadExcel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={15} /> Excel yuklash
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sana</th>
              <th>Operator</th>
              <th>Qarzdor</th>
              <th>Telefon</th>
              <th>Davomiyligi</th>
              <th>Natija</th>
              <th>Kategoriya</th>
              <th>To'lov usuli</th>
              <th>To'langan</th>
              <th>Izoh</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td className="muted">{fmtDate(s.date)}</td>
                <td>{s.operator_name}</td>
                <td style={{ fontWeight: 600 }}>{s.debtor_name}</td>
                <td className="muted">{s.phone}</td>
                <td className="muted">{fmtDuration(s.duration)}</td>
                <td>
                  <span className={`badge ${s.result === "To'lov" ? 'badge-green' : s.result === 'Muloqot' ? 'badge-indigo' : 'badge-gray'}`}>
                    {s.result}
                  </span>
                </td>
                <td className="muted">{s.category || '—'}</td>
                <td className="muted">{s.payment_method || '—'}</td>
                <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                  {s.paid_amount > 0 ? fmtMoney(s.paid_amount) : '—'}
                </td>
                <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
