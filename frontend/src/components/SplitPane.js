// src/components/SplitPane.js
import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import './SplitPane.css';

function SplitPane({ split = 'vertical', children }) {
  const [paneSize, setPaneSize] = useState('60%');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (split === 'vertical') {
      const containerWidth = container.getBoundingClientRect().width;
      let newSize = ((event.clientX - container.getBoundingClientRect().left) / containerWidth) * 100;
      if (newSize < 30) newSize = 30; // Minimum 30%
      if (newSize > 70) newSize = 70; // Maximum 70%
      setPaneSize(`${newSize}%`);
    } else {
      const containerHeight = container.getBoundingClientRect().height;
      let newSize = ((event.clientY - container.getBoundingClientRect().top) / containerHeight) * 100;
      if (newSize < 30) newSize = 30;
      if (newSize > 70) newSize = 70;
      setPaneSize(`${newSize}%`);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Box ref={containerRef} className="split-pane" sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: paneSize, overflow: 'auto' }}>
        {children[0]}
      </Box>
      <Box
        className="divider"
        onMouseDown={handleMouseDown}
        sx={{
          cursor: split === 'vertical' ? 'col-resize' : 'row-resize',
          width: split === 'vertical' ? '5px' : '100%',
          height: split === 'vertical' ? '100%' : '5px',
          backgroundColor: '#444',
        }}
      />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {children[1]}
      </Box>
    </Box>
  );
}

export default SplitPane;