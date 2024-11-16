// app.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import tagsRoutes from './routes/tags.js';
import llmRoutes from './routes/llm.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/llm', llmRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('StocksWiki Backend is running.');
});

// Error Handling Middleware for Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
