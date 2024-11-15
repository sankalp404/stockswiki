// tests/note.test.js
const { expect } = require('chai');
const { Note, User } = require('../models');

describe('Note Model', () => {
  before(async () => {
    await User.sync({ force: true });
    await Note.sync({ force: true });
  });

  it('should create a valid note', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'securepassword',
    });

    const note = await Note.create({
      content: 'Valid note content',
      summary: 'Valid summary',
      title: 'Valid Title',
      tickers: [
        {
          tickerSymbol: 'AAPL',
          tickerPrice: '150.00',
          priceChange: 'up',
        },
        {
          tickerSymbol: 'GOOGL',
          tickerPrice: '180.00',
          priceChange: 'unchanged',
        },
      ],
      date: '2024-11-20',
      userId: user.id,
      metadata: {},
    });

    expect(note.title).to.equal('Valid Title');
    expect(note.tickers).to.be.an('array').that.has.lengthOf(2);
    expect(note.tickers[0]).to.include({ tickerSymbol: 'AAPL', tickerPrice: '150.00', priceChange: 'up' });
    expect(note.tickers[1]).to.include({ tickerSymbol: 'GOOGL', tickerPrice: '180.00', priceChange: 'unchanged' });
  });

  // Add more tests as needed
});