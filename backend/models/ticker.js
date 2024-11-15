// models/ticker.js
'use strict';

export default (sequelize, DataTypes) => {
  const Ticker = sequelize.define('Ticker', {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  Ticker.associate = (models) => {
    Ticker.belongsToMany(models.Note, { through: 'NotesTickers', foreignKey: 'tickerId' });
  };

  return Ticker;
};
