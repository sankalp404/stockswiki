// backend/controllers/notesController.js
import db from '../models/index.js'; 

const { Note, Ticker } = db;

export async function createNote(req, res) {
  try {
    const { content, summary, title, ticker_metadata, date, userId } = req.body;
    const note = await Note.create({
      content,
      summary,
      title,
      ticker_metadata,
      date,
      userId,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getNotes(req, res) {
  try {
    const userId = req.user.id; // Extract userId from the authenticated user

    // Fetch notes for the authenticated user
    const notes = await Note.findAll({ where: { userId } });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { content, summary, ticker_metadata } = req.body;
    const userId = req.user.id; // Extracted from authenticated token

    // Find the note
    const note = await Note.findOne({ where: { id, userId } });
    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    // Update the note
    await note.update({
      content: content || note.content,
      summary: summary || note.summary,
      ticker_metadata: ticker_metadata || note.ticker_metadata,
    });

    // Optionally, handle associations (tags, tickers) here

    res.json({ message: 'Note updated successfully.', note });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Note update failed.', details: error.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    // Delete note
    await Note.destroy({ where: { id } });

    res.json({ message: 'Note deleted successfully.' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Note deletion failed.' });
  }
}
