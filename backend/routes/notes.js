// routes/notes.js
import { Router } from 'express';
const router = Router();
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js'; // Ensure the file extension is included
import { authenticateToken } from '../middleware/authMiddleware.js'; // Ensure the file extension is included

// Get all notes for the authenticated user
router.get('/', authenticateToken, getNotes);

// Create a new note
router.post('/', authenticateToken, createNote);

// Update a note
router.put('/:id', authenticateToken, updateNote);

// Delete a note
router.delete('/:id', authenticateToken, deleteNote);

export default router;
