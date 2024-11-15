// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import SplitPane from './SplitPane';
import ChatInterface from './ChatInterface';
import NotesApp from './NotesApp'; // Import the NotesApp component
import noteService from '../services/noteService';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await noteService.getNotes();
      setNotes(fetchedNotes);
      setSnackbar({ open: true, message: 'Notes fetched successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes.');
      setSnackbar({ open: true, message: 'Failed to fetch notes.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const [messages, setMessages] = useState([
    // Initial messages can be empty or pre-populated
    { id: 1, text: 'Welcome to the chat!', sender: 'system' },
  ]);

  // Handler to send a new message
  const handleSend = (newMessageText) => {
    const newMessage = {
      id: messages.length + 1, // Simple ID assignment
      text: newMessageText,
      sender: 'user', // Assuming the sender is the user
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // TODO: Implement actual message sending logic (e.g., API call)
  };

  // Handler to clear chat messages
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
      
      {/* Split Pane */}
      <SplitPane>
        
        {/* Left Pane - NotesApp */}
        <NotesApp selectedNote={selectedNote} setSelectedNote={setSelectedNote} />

        {/* Right Pane - ChatInterface with AppBar */}
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* AppBar */}
          <Header />

          {/* Chat Interface */}
          <Box sx={{ flexGrow: 1, padding: 2, overflowY: 'auto' }}>
            <ChatInterface messages={messages} onSend={handleSend} onClear={handleClear} />
          </Box>

        </Box>

      </SplitPane>

      {error && <div className="error-message">{error}</div>}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;