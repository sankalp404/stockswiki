'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV !== 'production') {
      await queryInterface.bulkInsert('NotesTags', [
        {
          noteId: 1,
          tagId: 1, // 'Finance'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 2,
          tagId: 2, // 'Technology'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 2,
          tagId: 3, // 'Software'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noteId: 3,
          tagId: 2, // 'Technology'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV !== 'production') {
      await queryInterface.bulkDelete('NotesTags', null, {});
    }
  }
};