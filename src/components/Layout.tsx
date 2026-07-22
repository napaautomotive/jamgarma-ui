import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface Props { title: string; children: ReactNode; }

export default function Layout({ title, children }: Props) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
