// models/user.js
'use strict';
import { genSalt, hash } from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9\-+()\s]*$/i, // Basic phone number validation
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'Users',
      hooks: {
        beforeCreate: async (user) => {
          const salt = await genSalt(10);
          user.password = await hash(user.password, salt);
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Note, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.belongsToMany(models.Tag, { through: 'NotesTags', foreignKey: 'userId' });
    User.belongsToMany(models.Ticker, { through: 'NotesTickers', foreignKey: 'userId' });
  };

  return User;
};
