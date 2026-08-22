import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDatabase } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tickets', ticketRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDatabase().then(() => app.listen(port, () => console.log(`SupportCRM API listening on port ${port}`)))
  .catch((error) => { console.error('Could not start server:', error.message); process.exit(1); });
