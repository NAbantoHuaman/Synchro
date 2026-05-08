import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;


const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🎵 YouTube Music API Bridge Ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
