// src/services/noteService.js
import axios from 'axios';
import authService from './authService'; // Adjust the path if necessary

const API_URL = 'http://localhost:5001/api/notes'; // Replace with your actual API endpoint

// Get all notes
const getNotes = async () => {
  const token = authService.getToken();
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error.response?.data || error.message);
    throw error;
  }
};

// Create a new note
const createNote = async (noteData) => {
  const token = authService.getToken();
  try {
    const response = await axios.post(API_URL, noteData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing note
const updateNote = async (id, noteData) => {
  const token = authService.getToken();
  try {
    const response = await axios.put(`${API_URL}/${id}`, noteData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a note
const deleteNote = async (id) => {
  const token = authService.getToken();
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting note:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};