// controllers/notesController.js
import db from '../models/index.js';

const { Note, Tag, Ticker } = db;

export const createNote = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Add this line
    console.log('userId:', req.user.id);

    const { content, summary, ticker_metadata, tagIds, title } = req.body;
    const userId = req.user.id; // Extract userId from authenticated user

    const newNote = await Note.create({
      content,
      summary,
      ticker_metadata,
      title,
      userId,
    });

    // Associate tags if provided
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await newNote.setTags(tags);
    }

    res.status(201).json({ message: 'Note created successfully.', note: newNote });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Note creation failed.', details: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the authenticated user

    // Fetch notes for the authenticated user with proper aliases
    const notes = await Note.findAll({
      where: { userId },
      include: [
        {
          model: Tag,
          as: 'tags', // Specify the alias
          through: { attributes: [] }, // Exclude join table attributes
        },
        {
          model: Ticker,
          as: 'tickers', // Specify the alias if applicable
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes.', details: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, summary, ticker_metadata, tagIds } = req.body;
    const userId = req.user.id; // Extracted from authenticated token

    // Find the note
    const note = await Note.findOne({ where: { id, userId }, include: ['tags'] });
    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    // Update the note
    await note.update({
      content: content || note.content,
      summary: summary || note.summary,
      ticker_metadata: ticker_metadata || note.ticker_metadata,
    });

    // Update tags associations
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await note.setTags(tags);
    }

    res.json({ message: 'Note updated successfully.', note });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Note update failed.', details: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete note
    await Note.destroy({ where: { id } });

    res.json({ message: 'Note deleted successfully.' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Note deletion failed.' });
  }
};
