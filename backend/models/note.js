// models/note.js
'use strict';

export default (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticker_metadata: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      // Temporarily comment out the validator
      /*
      validate: {
        isValidTickerMetadata(value) {
          if (value && Array.isArray(value)) {
            value.forEach(ticker => {
              console.log('Validating ticker:', ticker); // Debugging line
              if (!/^[A-Z]+$/.test(ticker.tickerSymbol)) {
                throw new Error('tickerSymbol must be a string of capital English alphabets');
              }
              if (!ticker.tickerPrice || !/^\d+(\.\d{1,2})?$/.test(ticker.tickerPrice)) {
                throw new Error('tickerPrice must be a valid currency format (e.g., 123.45)');
              }
              ticker.currency = ticker.currency || 'USD';
              if (!['up', 'down', 'unchanged'].includes(ticker.priceChange)) {
                throw new Error('priceChange must be "up", "down", or "unchanged"');
              }
            });
          } else if (value && !Array.isArray(value)) {
            throw new Error('ticker_metadata should be an array of JSON objects');
          }
        },
      },
      */
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Note.belongsToMany(models.Tag, { through: 'NotesTags', foreignKey: 'noteId' });
    Note.belongsToMany(models.Ticker, { through: 'NotesTickers', foreignKey: 'noteId' });
  };

  return Note;
};
