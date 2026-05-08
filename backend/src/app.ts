import express from 'express';
import cors from 'cors';
import musicRoutes from './routes/music.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', musicRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
