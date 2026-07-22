interface Props { title: string; }
export default function Header({ title }: Props) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>UZ / RU</span>
      </div>
    </header>
  );
}
