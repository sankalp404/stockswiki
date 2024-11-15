'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tickers', [
      {
        symbol: 'TSLA',
        price: '311.18',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        symbol: 'AAPL',
        price: '150.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        symbol: 'GOOGL',
        price: '180.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more tickers as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tickers', null, {});
  }
};