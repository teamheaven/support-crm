import { Ticket } from '../models/Ticket.js';

export async function generateTicketId() {
  const latestTicket = await Ticket.findOne().sort({ created_at: -1 }).select('ticket_id').lean();
  const latestNumber = latestTicket ? Number(latestTicket.ticket_id.replace('TKT-', '')) : 0;
  return `TKT-${String(latestNumber + 1).padStart(3, '0')}`;
}
