import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CreateTicketPage from './pages/CreateTicketPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TicketDetailsPage from './pages/TicketDetailsPage.jsx';

export default function App() { return <Layout><Routes><Route path="/" element={<DashboardPage />} /><Route path="/create" element={<CreateTicketPage />} /><Route path="/tickets/:ticketId" element={<TicketDetailsPage />} /><Route path="*" element={<DashboardPage />} /></Routes></Layout>; }
