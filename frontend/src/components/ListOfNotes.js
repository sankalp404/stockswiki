// src/components/ListOfNotes.js
import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';
import noteService from '../services/noteService'; 
import TickerChip from './TickerChip';

function getSnippet(content) {
  const lines = content.split('\n').slice(0, 2);
  return lines.join(' ');
}

function ListOfNotes({ notes, handleNoteSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    // Fetch available tags from the backend
    const fetchTags = async () => {
      try {
        const tags = await noteService.getTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };

  const filteredNotes = notes.filter((note) => {
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(lowerSearch);
    const tickerMatch = note.ticker_metadata?.some((ticker) =>
      ticker.tickerSymbol.toLowerCase().includes(lowerSearch)
    );
    const contentMatch = note.content.toLowerCase().includes(lowerSearch);

    const tagMatch =
      selectedTags.length === 0 ||
      (note.tags &&
        selectedTags.every((tag) => note.tags.map(t => t.name).includes(tag)));

    return (titleMatch || tickerMatch || contentMatch) && tagMatch;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Search and Filter Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          padding: 2,
          borderBottom: '1px solid #ddd',
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />

        {/* Tag Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="tag-filter-label">Filter by Tags</InputLabel>
          <Select
            labelId="tag-filter-label"
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            label="Filter by Tags"
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {availableTags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name} dense>
                <Checkbox checked={selectedTags.indexOf(tag.name) > -1} />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Notes List */}
      <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
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
                        <TickerChip
                          key={ticker.tickerSymbol}
                          symbol={ticker.tickerSymbol}
                          price={ticker.tickerPrice}
                          change={ticker.priceChange}
                        />
                      ))}
                    </Box>
                  )}
                  {/* Tags */}
                  {note.tags?.length > 0 && (
                    <Box sx={{ marginTop: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {note.tags.map((tag) => (
                        <Chip key={tag.id} label={`#${tag.name}`} size="small" />
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