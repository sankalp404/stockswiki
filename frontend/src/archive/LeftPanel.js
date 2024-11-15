// src/components/LeftPanel.js
import React, { useState } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, Typography, Chip, TextField } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import noteService from '../services/noteService';

function LeftPanel({ notes, setSelectedNote }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleNewNote = async () => {
    try {
      const newNote = await noteService.createNote({ title: 'Untitled', content: '', tickers: [] });
      setSelectedNote(newNote);
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  const getHeading = (content) => {
    const sentences = content.split('. ');
    const heading = sentences[0].split(' ').slice(0, 10).join(' ');
    return heading.length > 0 ? heading : 'Untitled';
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (note.tickers && note.tickers.some(ticker => ticker.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <Box sx={{ width: '100%', padding: 2, overflowY: 'auto', backgroundColor: '#1e1e1e', height: '100%' }}>
      <Button variant="contained" fullWidth onClick={handleNewNote} sx={{ marginBottom: 2 }}>
        New Note
      </Button>
      <Divider sx={{ marginBottom: 2 }} />

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          style: { backgroundColor: '#1e1e1e', color: '#ffffff' },
        }}
        sx={{ marginBottom: 2 }}
      />

      {/* Notes List */}
      <List>
        {filteredNotes.length > 0 ? (
          filteredNotes
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((note) => (
              <ListItem
                button
                key={note.id}
                onClick={() => handleNoteSelect(note)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 2 }}
              >
                <ListItemText
                  primary={<Typography variant="h6">{getHeading(note.content)}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {formatDistanceToNow(new Date(note.date), { addSuffix: true })}
                      </Typography>
                      <Box mt={1}>
                        {note.tickers && note.tickers.map((ticker, index) => (
                          <Chip key={index} label={ticker} size="small" sx={{ marginRight: 0.5 }} />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No notes found
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default LeftPanel;