'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Start a transaction for atomicity
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Define the seed data
      const notesData = [
        {
          content: 'How are you? $TSLA',
          summary: 'Daily stock update.',
          title: 'Hello',
          ticker_metadata: Sequelize.literal(`ARRAY[
            '{"tickerSymbol": "TSLA", "tickerPrice": "311.18", "priceChange": "down", "currency": "USD"}'::jsonb
          ]`),
          date: '2024-11-14',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'Market analysis $AAPL and $GOOGL',
          summary: 'Tech stocks overview.',
          title: 'Tech Insights',
          ticker_metadata: Sequelize.literal(`ARRAY[
            '{"tickerSymbol": "AAPL", "tickerPrice": "150.00", "priceChange": "unchanged", "currency": "USD"}'::jsonb,
            '{"tickerSymbol": "GOOGL", "tickerPrice": "100.00", "priceChange": "up", "currency": "USD"}'::jsonb
          ]`),
          date: '2024-11-15',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'Market analysis of Waymo $GOOGL',
          summary: 'Waymo stock discussion.',
          title: 'Waymo Insights',
          ticker_metadata: Sequelize.literal(`ARRAY[
            '{"tickerSymbol": "GOOGL", "tickerPrice": "100.00", "priceChange": "up", "currency": "USD"}'::jsonb
          ]`),
          date: '2024-11-16',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Log the data being inserted for debugging
      console.log('Seeding Notes with the following data:', JSON.stringify(notesData, null, 2));

      // Perform the bulk insert within the transaction
      await queryInterface.bulkInsert('Notes', notesData, { transaction });

      // Commit the transaction if all inserts succeed
      await transaction.commit();
      console.log('Seeding Notes completed successfully.');
    } catch (error) {
      // Rollback the transaction in case of errors
      await transaction.rollback();
      console.error('Seeding failed:', error);
      throw error; // Rethrow the error to signal failure
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, delete the inserted notes
    await queryInterface.bulkDelete('Notes', null, {});
    console.log('Removed seeded Notes.');
  },
};