'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV !== 'production') {
      await queryInterface.bulkInsert('NotesTickers', [
        {
          noteId: 1,
          tickerId: 1, // Ticker ID 1 (TSLA)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 2, 
          tickerId: 2, // Ticker ID 2 (AAPL) 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 2, 
          tickerId: 3, // Ticker ID 3 (GOOGL)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 3, 
          tickerId: 3, // Ticker ID 3 (GOOGL)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV !== 'production') {
      await queryInterface.bulkDelete('NotesTickers', null, {});
    }
  }
};