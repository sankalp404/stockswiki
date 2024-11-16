// routes/notes.js
import { Router } from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Get all notes for the authenticated user
router.get('/', authenticateToken, getNotes);

// Create a new note
router.post('/', authenticateToken, createNote);

// Update a note
router.put('/:id', authenticateToken, updateNote);

// Delete a note
router.delete('/:id', authenticateToken, deleteNote);

export default router;
