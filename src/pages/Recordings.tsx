import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { CALL_SESSIONS } from '../data/mock';
import { fmtMoney, fmtDuration, fmtDate } from '../utils/format';

const OPERATORS = ['Barchasi', ...Array.from(new Set(CALL_SESSIONS.map(s => s.operator_name)))];

export default function Recordings() {
  const [operator, setOperator] = useState('Barchasi');

  const filtered = useMemo(() =>
    operator === 'Barchasi' ? CALL_SESSIONS : CALL_SESSIONS.filter(s => s.operator_name === operator),
    [operator]
  );

  return (
    <Layout title="Yozuvlar">
      <div className="page-header">
        <div>
          <div className="page-title">Qo'ng'iroqlar tarixi</div>
          <div className="page-sub">{filtered.length} ta yozuv</div>
        </div>
        <select className="input" style={{ width: 200 }} value={operator} onChange={e => setOperator(e.target.value)}>
          {OPERATORS.map(o => <option key={o}>{o}</option>)}
        </select>
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
