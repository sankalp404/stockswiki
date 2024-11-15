// src/components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'; // Better clear icon
import PropTypes from 'prop-types';
import { format, isToday, isYesterday } from 'date-fns';

function ChatInterface({ messages = [], onSend, onClear }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const formatTime = (date) => format(date, 'h:mm a');

  const renderMessages = () => {
    let lastDate = null;

    return messages.map((msg) => {
      const messageDate = new Date(msg.timestamp);
      if (isNaN(messageDate)) {
        console.error('Invalid timestamp:', msg.timestamp);
        return null;
      }
      const showDate = lastDate !== formatDate(messageDate);
      lastDate = formatDate(messageDate);

      return (
        <React.Fragment key={msg.id}>
          {showDate && (
            <Box sx={{ textAlign: 'center', marginY: 2 }}>
              <Divider />
              <Typography variant="caption" color="text.secondary">
                {lastDate}
              </Typography>
              <Divider />
            </Box>
          )}
          <ListItem
            sx={{
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              padding: '8px 0',
            }}
          >
            <Paper
              sx={{
                padding: '8px 12px',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.800',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                maxWidth: '75%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
            <Typography variant="caption" sx={{ marginTop: 0.5, color: 'text.secondary' }}>
              {msg.sender} • {formatTime(messageDate)}
            </Typography>
          </ListItem>
        </React.Fragment>
      );
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 2,
          backgroundColor: 'background.default',
        }}
      >
        {messages.length > 0 ? (
          <List>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        )}
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <IconButton
          color="secondary"
          onClick={onClear}
          sx={{ marginRight: 1 }}
        >
          <DeleteSweepIcon />
        </IconButton>
        <TextField
          label="Type your message..."
          variant="outlined"
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ marginRight: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

ChatInterface.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired, // Ensure timestamp is included
    })
  ).isRequired,
  onSend: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired, // Add onClear prop type
};

export default ChatInterface;