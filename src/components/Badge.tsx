import type { MuloqotStatus, RiskLevel } from '../data/mock';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const cls = level === 'Past' ? 'badge-green' : level === "O'rta" ? 'badge-amber' : 'badge-red';
  return <span className={`badge ${cls}`}>{level}</span>;
}

export function MuloqotBadge({ status }: { status: MuloqotStatus }) {
  if (!status) return <span className="badge badge-gray">—</span>;
  if (status === 'tugadi') return <span className="badge badge-green">Tugadi</span>;
  if (status === 'qisman') return <span className="badge badge-blue">Qisman</span>;
  return <span className="badge badge-amber">Javob bermadi</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${status === 'Faol' ? 'badge-green' : 'badge-gray'}`}>{status}</span>;
}
