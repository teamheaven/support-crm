import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  // Agents use this stable ID in the UI; MongoDB still keeps its own _id for document identity.
  ticket_id: { type: String, required: true, unique: true, index: true },
  customer_name: { type: String, required: true, trim: true, index: true },
  customer_email: { type: String, required: true, trim: true, lowercase: true, index: true },
  subject: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open', index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { versionKey: false });

export const Ticket = mongoose.model('Ticket', ticketSchema);
