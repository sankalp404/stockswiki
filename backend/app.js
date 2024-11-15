// app.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import tagsRoutes from './routes/tags.js';
import llmRoutes from './routes/llm.js';

const { json, urlencoded } = pkg;

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/llm', llmRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('StocksWiki Backend is running.');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
