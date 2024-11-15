// src/utils/tickerUtils.js
export function parseTickers(text) {
  // Updated regex to match uppercase words (assumed tickers) and include numbers
  const regex = /\b[A-Z0-9]{1,5}\b/g;
  const matches = text.match(regex);
  // Remove duplicates
  return matches ? Array.from(new Set(matches)) : [];
}