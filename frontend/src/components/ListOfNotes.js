// src/components/ListOfNotes.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Typography,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';

function getSnippet(content) {
  const lines = content.split('\n').slice(0, 2);
  return lines.join(' ');
}

function ListOfNotes({ notes, handleNoteSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes.filter((note) => {
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(lowerSearch);
    const tickerMatch = note.ticker_metadata?.some((ticker) =>
      ticker.tickerSymbol.toLowerCase().includes(lowerSearch)
    );
    const contentMatch = note.content.toLowerCase().includes(lowerSearch);
    return titleMatch || tickerMatch || contentMatch;
  });

  return (
    <Box
      sx={{
        maxHeight: '100%',
        overflowY: 'auto',
        padding: 2,
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search by keyword or ticker..."
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        size="small"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Notes List */}
      <List className="list-of-notes">
        {filteredNotes.length > 0 ? (
          filteredNotes
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((note) => (
              <Card
                key={note.id}
                variant="outlined"
                className="note-card"
                onClick={() => handleNoteSelect(note)}
                sx={{
                  marginBottom: 1,
                  cursor: 'pointer',
                  padding: 1,
                  backgroundColor: 'background.default',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  },
                }}
              >
                <CardContent>
                  {/* Note Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      color: 'text.primary',
                    }}
                  >
                    {note.title || 'Untitled'}
                  </Typography>

                  {/* Summary Snippet */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.875rem',
                      marginTop: 1,
                    }}
                  >
                    {getSnippet(note.content)}
                  </Typography>

                  {/* Tickers */}
                  {note.ticker_metadata?.length > 0 && (
                    <Box
                      sx={{
                        marginTop: 1,
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      {note.ticker_metadata.map((ticker) => (
                        <Chip
                          key={ticker.tickerSymbol}
                          label={`${ticker.tickerSymbol}: ${ticker.price || 'N/A'}`}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: '20px',
                            backgroundColor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span style={{ color: 'black' }}>{ticker.tickerSymbol}</span>:
                          <span
                            style={{
                              color:
                                ticker.change === 'up'
                                  ? 'green'
                                  : ticker.change === 'down'
                                    ? 'red'
                                    : 'black',
                            }}
                          >
                            {ticker.price}
                          </span>
                        </Chip>
                      ))}
                    </Box>
                  )}

                  {/* Date Information */}
                  <Typography variant="caption" color="textSecondary" className="note-date">
                    {formatDistanceToNow(new Date(note.date), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            ))
        ) : (
          <Typography variant="body1">No notes available.</Typography>
        )}
      </List>
    </Box>
  );
}

ListOfNotes.propTypes = {
  notes: PropTypes.array.isRequired,
  handleNoteSelect: PropTypes.func.isRequired,
};

export default ListOfNotes;