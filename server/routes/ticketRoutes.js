import { Router } from 'express';
import { createTicket, getTicket, getTickets, updateTicket } from '../controllers/ticketController.js';

const router = Router();
router.route('/').get(getTickets).post(createTicket);
router.route('/:ticket_id').get(getTicket).put(updateTicket);
export default router;
