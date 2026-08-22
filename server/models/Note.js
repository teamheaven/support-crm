import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  // Matching the ticket's public ID keeps note lookups simple without exposing MongoDB _id values in routes.
  ticket_id: { type: String, required: true, index: true },
  note_text: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false });

export const Note = mongoose.model('Note', noteSchema);
