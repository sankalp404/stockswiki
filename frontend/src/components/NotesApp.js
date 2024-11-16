// src/components/NotesApp.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListOfNotes from './ListOfNotes';
import NoteEditor from './NoteEditor';
import noteService from '../services/noteService';

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // Initialize as null

  // Define the fetchNotes function
  const fetchNotes = async () => {
    try {
      const fetchedNotes = await noteService.getNotes();
      setNotes(fetchedNotes);
      setSelectedNote(null); // Always open a new note after fetching
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Fetch notes when the component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Sidebar - List of Notes */}
      <Box
        sx={{
          width: '300px',
          borderRight: '1px solid #444',
          overflowY: 'auto',
          backgroundColor: 'background.paper',
        }}
      >
        <ListOfNotes
          notes={notes}
          handleNoteSelect={handleNoteSelect}
        />
      </Box>
      {/* Main Editor - Note Editor */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 1,
          overflowY: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <NoteEditor
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          fetchNotes={fetchNotes}
        />
      </Box>
    </Box>
  );
}

export default NotesApp;