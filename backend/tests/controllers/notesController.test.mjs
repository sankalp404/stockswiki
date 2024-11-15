// tests/controllers/notesController.test.mjs
import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.js'; // Ensure this path is correct
import { Note, User } from '../../models';

describe('Notes Controller', () => {
  before(async () => {
    await User.sync({ force: true });
    await Note.sync({ force: true });
  });

  it('should create a note successfully', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'securepassword',
    });

    const response = await request(app)
      .post('/api/notes')
      .send({
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

    expect(response.status).to.equal(201);
    expect(response.body.title).to.equal('Valid Title');
  });

  // Add more tests as needed
});