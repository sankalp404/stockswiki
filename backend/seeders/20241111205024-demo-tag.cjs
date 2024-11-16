'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tags', [
      {
        name: 'Finance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Software',
        parentId: 2, // Nested under 'Technology'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more tags as needed
    ], {});
    
    // Reset the id sequence to prevent duplicates
    await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"Tags"', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM "Tags";`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};