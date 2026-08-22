import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
const messageFromError = (error) => error.response?.data?.message || 'Unable to reach the server. Please try again.';

export async function getTickets(params) { try { return (await api.get('/tickets', { params })).data; } catch (error) { throw new Error(messageFromError(error)); } }
export async function getTicket(ticketId) { try { return (await api.get(`/tickets/${ticketId}`)).data; } catch (error) { throw new Error(messageFromError(error)); } }
export async function createTicket(data) { try { return (await api.post('/tickets', data)).data; } catch (error) { throw new Error(messageFromError(error)); } }
export async function updateTicket(ticketId, data) { try { return (await api.put(`/tickets/${ticketId}`, data)).data; } catch (error) { throw new Error(messageFromError(error)); } }
