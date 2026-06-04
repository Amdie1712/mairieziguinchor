import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createRequire } from 'module';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(bodyParser.json());

  // Static Uploads
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Import Backend Routes (using require because they are CJS)
  const authRoutes = require('./backend/routes/auth');
  const articleRoutes = require('./backend/routes/articles');
  const eventRoutes = require('./backend/routes/events');
  const councilRoutes = require('./backend/routes/council');
  const reportRoutes = require('./backend/routes/reports');
  const messageRoutes = require('./backend/routes/messages');
  const dossierRoutes = require('./backend/routes/dossiers');
  const contentRoutes = require('./backend/routes/content');
  const participationRoutes = require('./backend/routes/participation');
  const projectRoutes = require('./backend/routes/projects');
  const systemRoutes = require('./backend/routes/system');

  // Use Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/council', councilRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/dossiers', dossierRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/participation', participationRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/system', systemRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Unified Server running on http://localhost:${PORT}`);
    console.log(`API available at /api`);

    // Auto-seed if database is empty
    try {
      const Content = require('./backend/models/Content');
      const procedures = await Content.getProcedures();
      if (procedures.length === 0) {
        console.log('Database empty, seeding initial data...');
        await Content.seedData();
        console.log('Seeding completed.');
      }
    } catch (err) {
      console.error('Error during auto-seeding:', err);
    }
  });
}

startServer();
