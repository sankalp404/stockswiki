// src/components/SplitScreen.js
import React, { useState, useRef, useEffect } from 'react';
import './SplitScreen.css';

const SplitScreen = ({ left: LeftComponent, right: RightComponent }) => {
  const [dividerPosition, setDividerPosition] = useState(window.innerWidth / 2);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging.current) {
        setDividerPosition(e.clientX);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  return (
    <div className="split-screen">
      <div className="left-pane" style={{ width: dividerPosition }}>
        <LeftComponent />
      </div>
      <div className="divider" onMouseDown={handleMouseDown} style={{ left: dividerPosition }} />
      <div className="right-pane" style={{ left: dividerPosition, width: `calc(100% - ${dividerPosition}px)` }}>
        <RightComponent />
      </div>
    </div>
  );
};

export default SplitScreen;