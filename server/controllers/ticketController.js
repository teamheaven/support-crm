import { Note } from '../models/Note.js';
import { Ticket } from '../models/Ticket.js';
import { generateTicketId } from '../utils/ticketId.js';

const validStatuses = ['Open', 'In Progress', 'Closed'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function invalidRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export async function createTicket(req, res, next) {
  try {
    const { customer_name, customer_email, subject, description } = req.body;
    if (![customer_name, customer_email, subject, description].every((value) => value?.trim())) {
      throw invalidRequest('Customer name, email, subject, and description are required.');
    }
    if (!emailPattern.test(customer_email.trim())) throw invalidRequest('Please provide a valid customer email address.');

    const ticket = await Ticket.create({ ticket_id: await generateTicketId(), customer_name, customer_email, subject, description });
    res.status(201).json({ ticket_id: ticket.ticket_id, created_at: ticket.created_at });
  } catch (error) { next(error); }
}

export async function getTickets(req, res, next) {
  try {
    const { status, search } = req.query;
    if (status && !validStatuses.includes(status)) throw invalidRequest('Invalid ticket status.');
    const query = status ? { status } : {};
    if (search?.trim()) {
      const expression = new RegExp(search.trim(), 'i');
      // $or is added to the status query, so search and status filters work together.
      query.$or = ['ticket_id', 'customer_name', 'customer_email', 'subject', 'description'].map((field) => ({ [field]: expression }));
    }
    const tickets = await Ticket.find(query)
      .select('ticket_id customer_name subject status created_at updated_at')
      .sort({ created_at: -1 })
      .lean();
    res.json(tickets);
  } catch (error) { next(error); }
}

export async function getTicket(req, res, next) {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id }).lean();
    if (!ticket) { const error = new Error('Ticket not found.'); error.status = 404; throw error; }
    const notes = await Note.find({ ticket_id: ticket.ticket_id }).sort({ created_at: -1 }).lean();
    res.json({ ...ticket, notes });
  } catch (error) { next(error); }
}

export async function updateTicket(req, res, next) {
  try {
    const { status, note_text } = req.body;
    if (status !== undefined && !validStatuses.includes(status)) throw invalidRequest('Invalid ticket status.');
    if (note_text !== undefined && !note_text.trim()) throw invalidRequest('A note cannot be empty.');
    if (status === undefined && note_text === undefined) throw invalidRequest('Provide a status or note to update this ticket.');
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) { const error = new Error('Ticket not found.'); error.status = 404; throw error; }

    if (status !== undefined) ticket.status = status;
    ticket.updated_at = new Date();
    await ticket.save();
    if (note_text !== undefined) await Note.create({ ticket_id: ticket.ticket_id, note_text });
    res.json({ success: true, updated_at: ticket.updated_at });
  } catch (error) { next(error); }
}
