import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import { getTickets } from '../services/ticketApi.js';

const statuses = ['Open', 'In Progress', 'Closed'];
const formatDate = (date) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric'
}).format(new Date(date));

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { loadTickets(); }, [search, status]);

  async function loadTickets() {
    setLoading(true);
    setError('');
    try {
      // Counts should describe the whole queue, not only the current search or status result.
      const [filteredTickets, everyTicket] = await Promise.all([
        getTickets({ ...(search && { search }), ...(status && { status }) }),
        getTickets()
      ]);
      setTickets(filteredTickets);
      setAllTickets(everyTicket);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const countFor = (ticketStatus) => allTickets.filter((ticket) => ticket.status === ticketStatus).length;
  const statistics = [
    ['Total Tickets', allTickets.length, 'text-slate-900'],
    ['Open', countFor('Open'), 'text-blue-700'],
    ['In Progress', countFor('In Progress'), 'text-amber-700'],
    ['Closed', countFor('Closed'), 'text-slate-600']
  ];

  return (
    <div className="page space-y-7">
      <section>
        <p className="text-sm font-medium text-indigo-600">Support workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Tickets at a glance</h1>
        <p className="mt-1 text-sm text-slate-500">Keep customer issues moving with a simple shared queue.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map(([label, value, color]) => (
          <div key={label} className="panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="field mt-0 flex-1" placeholder="Search tickets..." aria-label="Search tickets" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="field mt-0 sm:w-44" aria-label="Filter by status">
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {loading && <p className="p-8 text-center text-sm text-slate-500">Loading tickets...</p>}
        {error && !loading && <ErrorState message={error} onRetry={loadTickets} />}
        {!loading && !error && tickets.length === 0 && <EmptyState isFiltered={Boolean(search || status)} />}
        {!loading && !error && tickets.length > 0 && <TicketList tickets={tickets} />}
      </section>
    </div>
  );
}

function TicketList({ tickets }) {
  return <>
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-5 py-3">Ticket ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Last updated</th></tr>
        </thead>
        <tbody>{tickets.map((ticket) => <tr key={ticket.ticket_id} className="border-t border-slate-100 hover:bg-slate-50">
          <td className="px-5 py-4"><Link className="font-medium text-indigo-600 hover:underline" to={`/tickets/${ticket.ticket_id}`}>{ticket.ticket_id}</Link></td>
          <td className="px-5 py-4">{ticket.customer_name}</td><td className="px-5 py-4">{ticket.subject}</td>
          <td className="px-5 py-4"><StatusBadge status={ticket.status} /></td>
          <td className="px-5 py-4 text-slate-500">{formatDate(ticket.created_at)}</td>
          <td className="px-5 py-4 text-slate-500">{formatDate(ticket.updated_at)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="divide-y divide-slate-100 md:hidden">{tickets.map((ticket) => <Link key={ticket.ticket_id} to={`/tickets/${ticket.ticket_id}`} className="block p-4 hover:bg-slate-50">
      <div className="flex justify-between gap-3"><span className="font-medium text-indigo-600">{ticket.ticket_id}</span><StatusBadge status={ticket.status} /></div>
      <p className="mt-2 font-medium">{ticket.subject}</p>
      <p className="mt-1 text-sm text-slate-500">{ticket.customer_name} · Created {formatDate(ticket.created_at)}</p>
      <p className="mt-1 text-xs text-slate-500">Last updated {formatDate(ticket.updated_at)}</p>
    </Link>)}</div>
  </>;
}

function EmptyState({ isFiltered }) {
  return <div className="p-10 text-center"><p className="font-medium">{isFiltered ? 'No tickets match your search.' : 'No tickets yet.'}</p><p className="mt-1 text-sm text-slate-500">{isFiltered ? 'Try changing your search or filter.' : 'Create your first support ticket to get started.'}</p>{!isFiltered && <Link to="/create" className="button-primary mt-4">Create ticket</Link>}</div>;
}

function ErrorState({ message, onRetry }) {
  return <div className="p-8 text-center"><p className="text-sm text-red-600">Unable to load tickets. {message}</p><button onClick={onRetry} className="button-secondary mt-3">Try again</button></div>;
}
