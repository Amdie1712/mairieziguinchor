const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const eventRoutes = require('./routes/events');
const councilRoutes = require('./routes/council');
const reportRoutes = require('./routes/reports');
const messageRoutes = require('./routes/messages');
const dossierRoutes = require('./routes/dossiers');
const contentRoutes = require('./routes/content');
const participationRoutes = require('./routes/participation');
const projectRoutes = require('./routes/projects');

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

// Start Server
app.listen(PORT, () => {
    console.log(`Serveur Backend démarré sur http://localhost:${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api`);
});