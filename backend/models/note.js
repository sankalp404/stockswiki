// backend/models/note.js
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
      allowNull: false,
      defaultValue: {},
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticker_metadata: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
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
  }, {});

  Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Note.belongsToMany(models.Tag, {
      through: 'NotesTags',
      foreignKey: 'noteId',
      otherKey: 'tagId',
      as: 'tags',
    });
    Note.belongsToMany(models.Ticker, {
      through: 'NotesTickers',
      foreignKey: 'noteId',
      otherKey: 'tickerId',
      as: 'tickers'
    });
  };

  return Note;
};
