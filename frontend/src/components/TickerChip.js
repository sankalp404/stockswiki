// src/components/TickerChip.js
import React from 'react';
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

const tickerChipStyle = {
  fontSize: '0.75rem',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  color: '#fff',
  gap: '4px',
};

const TickerChip = ({ symbol, price, change }) => {
  let priceColor = 'black';
  if (change === 'up') priceColor = 'green';
  else if (change === 'down') priceColor = 'red';

  return (
    <Chip
      size="small"
      sx={tickerChipStyle}
      label={
        <>
          <strong style={{ color: 'black' }}>{symbol}:</strong>
          <strong style={{ color: priceColor }}>{price || 'N/A'}</strong>
        </>
      }
    />
  );
};

TickerChip.propTypes = {
  symbol: PropTypes.string.isRequired,
  price: PropTypes.string,
  change: PropTypes.string,
};

TickerChip.defaultProps = {
  price: 'N/A',
  change: 'unchanged',
};

export default TickerChip;