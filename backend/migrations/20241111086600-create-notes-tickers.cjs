'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NotesTickers', {
      noteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      tickerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Tickers', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NotesTickers');
  }
};
