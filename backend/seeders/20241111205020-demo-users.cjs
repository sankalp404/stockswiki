'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'john@example.com',
        password: hashedPassword1,
        role: 'user',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        address: '123 Main St',
        state: 'CA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'jane@example.com',
        password: hashedPassword2,
        role: 'admin',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '098-765-4321',
        address: '456 Elm St',
        state: 'NY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
