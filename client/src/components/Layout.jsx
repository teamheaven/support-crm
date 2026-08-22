import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return <><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><Link to="/" className="text-lg font-bold tracking-tight text-slate-900">Support<span className="text-indigo-600">CRM</span></Link><Link className={pathname === '/create' ? 'button-primary' : 'button-secondary'} to="/create">New ticket</Link></div></header><main>{children}</main></>;
}
