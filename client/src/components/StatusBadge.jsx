const styles = { Open: 'bg-blue-50 text-blue-700 ring-blue-600/20', 'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20', Closed: 'bg-slate-100 text-slate-700 ring-slate-500/20' };
export default function StatusBadge({ status }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>{status}</span>; }
