// frontend/src/components/NoteEditor.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Tooltip,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Chip,
  Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MDEditor from '@uiw/react-md-editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';
import noteService from '../services/noteService';
import authService from '../services/authService';
import axios from 'axios';
import TagIcon from '@mui/icons-material/Tag';

const TICKER_REGEX = /\b[A-Z0-9]{1,5}\b/g;

function NoteEditor({ selectedNote, setSelectedNote, fetchNotes }) {
  const { id: userId } = authService.getCurrentUser();
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [content, setContent] = useState('');
  const [tickers, setTickers] = useState([]);
  const [tickerPrices, setTickerPrices] = useState({});
  const [summary, setSummary] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    // Fetch available tags for autocomplete
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

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
      const loadedTickers = Array.isArray(selectedNote.ticker_metadata)
        ? selectedNote.ticker_metadata
        : [];
      setTickers(loadedTickers.map(t => t.tickerSymbol));
      const prices = {};
      loadedTickers.forEach(t => {
        prices[t.tickerSymbol] = {
          price: t.tickerPrice,
          change: t.priceChange,
          currency: t.currency,
        };
      });
      setTickerPrices(prices);
      setSelectedTags(selectedNote.tags ? selectedNote.tags.map(tag => tag.id) : []);
      setSummary(selectedNote.summary || '');
      setIsEditingTitle(false);
    } else {
      setTitle('');
      setContent('');
      setTickers([]);
      setTickerPrices({});
      setSelectedTags([]);
      setSummary('');
      setIsEditingTitle(true); // Enable title input for new notes
    }
  }, [selectedNote]);

  useEffect(() => {
    const extractedTickers = Array.from(
      new Set([...content.matchAll(TICKER_REGEX)].map(match => match[0]))
    );
    const newTickers = extractedTickers.filter(ticker => !(ticker in tickerPrices));
    if (newTickers.length > 0) {
      const fetchTickerPrices = async () => {
        const prices = { ...tickerPrices };
        const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
        let fetchFailedTickers = [];
        for (const ticker of newTickers) {
          try {
            const response = await axios.get('https://finnhub.io/api/v1/quote', {
              params: {
                symbol: ticker,
                token: apiKey,
              },
            });
            const currentPrice = response.data.c;
            const previousPrice = response.data.pc;
            prices[ticker] = {
              price: currentPrice ? `$${currentPrice.toFixed(2)}` : 'N/A',
              change:
                currentPrice && previousPrice
                  ? currentPrice > previousPrice
                    ? 'up'
                    : currentPrice < previousPrice
                      ? 'down'
                      : 'unchanged'
                  : 'unchanged',
              currency: 'USD',
            };
          } catch (error) {
            console.error(`Error fetching price for ${ticker}:`, error);
            fetchFailedTickers.push(ticker);
            prices[ticker] = {
              price: 'N/A',
              change: 'unchanged',
              currency: 'USD',
            };
          }
        }
        setTickerPrices(prices);
        if (fetchFailedTickers.length > 0) {
          setSnackbar({
            open: true,
            message: `Failed to fetch prices for: ${fetchFailedTickers.join(', ')}`,
            severity: 'error',
          });
        }
      };
      fetchTickerPrices();
    }
    setTickers(extractedTickers);
  }, [content, tickerPrices]);

  useEffect(() => {
    if (content) {
      const lines = content.split('\n').slice(0, 5).join('\n');
      setSummary(lines);
    } else {
      setSummary('');
    }
  }, [content]);

  const handleSave = async () => {
    if (typeof fetchNotes !== 'function') {
      console.error('fetchNotes prop is not a function');
      return;
    }
    let finalSummary = summary;
    if (!summary.trim()) {
      finalSummary = 'This is an auto-generated summary.';
      // TODO: Integrate actual summary generation logic
    }

    // Prepare ticker metadata
    const tickerMetadata = tickers.map(ticker => ({
      tickerSymbol: ticker,
      tickerPrice: tickerPrices[ticker]?.price || 'N/A',
      priceChange: tickerPrices[ticker]?.change || 'unchanged',
      currency: tickerPrices[ticker]?.currency || 'USD',
    }));

    // Prepare note data with tag IDs
    const updatedNote = {
      id: selectedNote ? selectedNote.id : undefined,
      content,
      summary: finalSummary,
      title,
      ticker_metadata: tickerMetadata,
      userId: userId,
      tagIds: selectedTags,
    };

    try {
      if (selectedNote) {
        await noteService.updateNote(selectedNote.id, updatedNote);
        setSnackbar({
          open: true,
          message: 'Note updated successfully!',
          severity: 'success',
        });
      } else {
        await noteService.createNote(updatedNote);
        setSnackbar({
          open: true,
          message: 'Note created successfully!',
          severity: 'success',
        });
      }
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save note.',
        severity: 'error',
      });
    }
  };

  const handleAddTag = (event, value) => {
    setSelectedTags(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'background.paper' }}>
      {/* Header with Title and Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {isEditingTitle ? (
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              variant="outlined"
              size="small"
              placeholder="Enter note title..."
              sx={{ flexGrow: 1, marginRight: 1 }}
            />
          ) : (
            <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => setIsEditingTitle(true)}>
              {title || 'Untitled'}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Save">
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="New Note">
            <IconButton onClick={() => setSelectedNote(null)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Note">
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error" disabled={!selectedNote}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tag Selector */}
      <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={availableTags.map((option) => option.name)}
          getOptionLabel={(option) => option}
          value={availableTags.filter(tag => selectedTags.includes(tag.id)).map(tag => tag.name)}
          onChange={(event, newValue) => {
            const selectedTagIds = newValue.map(tagName => {
              const tag = availableTags.find(t => t.name === tagName);
              return tag ? tag.id : null;
            }).filter(id => id !== null);
            setSelectedTags(selectedTagIds);
          }}
          filterSelectedOptions
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Select or create tags"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <TagIcon sx={{ marginRight: 1, color: 'action.active' }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Markdown Editor */}
      <Box sx={{ flexGrow: 1, marginBottom: 1, paddingX: 2 }}>
        <MDEditor
          value={content}
          onChange={setContent}
          height={300}
          preview="edit"
          textareaProps={{
            placeholder: 'Write your note in Markdown...',
          }}
          visibleDragbar={false}
        />
      </Box>

      {/* Display Tags Below Editor */}
      {selectedNote && selectedTags.length > 0 && (
        <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
          {availableTags
            .filter(tag => selectedTags.includes(tag.id))
            .map((tag) => (
              <Chip key={tag.id} label={`#${tag.name}`} size="small" sx={{ marginRight: 0.5 }} />
            ))}
        </Box>
      )}

      {/* Tickers Section */}
      {tickers.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginY: 2, paddingX: 2 }}>
          {tickers.map(ticker => (
            <Chip
              key={ticker}
              label={`${ticker}: ${tickerPrices[ticker]?.price || 'N/A'}`}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: '24px',
                backgroundColor: 'grey.300',
                color:
                  tickerPrices[ticker]?.change === 'up'
                    ? 'green'
                    : tickerPrices[ticker]?.change === 'down'
                      ? 'red'
                      : 'black',
              }}
            />
          ))}
        </Box>
      )}
      {/* Summary Box */}
      <Box sx={{ margin: 2, backgroundColor: 'summary.main', padding: 2, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ marginBottom: 1, color: 'text.primary' }}>
          Summary
        </Typography>
        {summary ? (
          <Box sx={{ backgroundColor: 'summary.main', color: 'text.primary', padding: 1, borderRadius: 1 }}>
            <ReactQuill
              value={summary}
              readOnly={true}
              theme="bubble"
              modules={{ toolbar: false }}
              style={{ height: '250px', overflow: 'hidden' }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No summary available.
          </Typography>
        )}
      </Box>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await noteService.deleteNote(selectedNote.id);
                setSnackbar({
                  open: true,
                  message: 'Note deleted successfully!',
                  severity: 'success',
                });
                fetchNotes();
              } catch (error) {
                console.error('Error deleting note:', error);
                setSnackbar({
                  open: true,
                  message: 'Failed to delete note.',
                  severity: 'error',
                });
              } finally {
                setDeleteDialogOpen(false);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

NoteEditor.propTypes = {
  selectedNote: PropTypes.object,
  setSelectedNote: PropTypes.func.isRequired,
  fetchNotes: PropTypes.func.isRequired,
};

NoteEditor.defaultProps = {
  selectedNote: null,
};

export default NoteEditor;