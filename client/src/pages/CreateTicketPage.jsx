import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketApi.js';

const initialForm = { customer_name: '', customer_email: '', subject: '', description: '' };

function validateTicket(form) {
  const errors = {};
  if (!form.customer_name.trim()) errors.customer_name = 'Customer name is required.';
  if (!form.customer_email.trim()) errors.customer_email = 'Customer email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(form.customer_email)) errors.customer_email = 'Enter a valid email address.';
  if (!form.subject.trim()) errors.subject = 'Subject is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  return errors;
}

export default function CreateTicketPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateTicket(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      const ticket = await createTicket(form);
      navigate(`/tickets/${ticket.ticket_id}`, { state: { notice: `${ticket.ticket_id} was created successfully.` } });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page max-w-3xl">
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">← Back to tickets</Link>
      <div className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight">Create a support ticket</h1>
        <p className="mt-1 text-sm text-slate-500">Capture enough detail for the support team to take the next step.</p>
      </div>
      <form onSubmit={submit} className="panel mt-6 space-y-5 p-5 sm:p-7">
        {serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
        <FormField label="Customer name" name="customer_name" value={form.customer_name} error={errors.customer_name} onChange={changeField} />
        <FormField label="Customer email" name="customer_email" type="email" value={form.customer_email} error={errors.customer_email} onChange={changeField} />
        <FormField label="Subject" name="subject" value={form.subject} error={errors.subject} onChange={changeField} />
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea name="description" rows="6" value={form.description} onChange={changeField} className="field resize-y" />
          {errors.description && <span className="mt-1 block text-xs text-red-600">{errors.description}</span>}
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <Link to="/" className="button-secondary">Cancel</Link>
          <button disabled={submitting} className="button-primary">{submitting ? 'Creating ticket...' : 'Create ticket'}</button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, name, type = 'text', value, error, onChange }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input name={name} type={type} value={value} onChange={onChange} className="field" />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
