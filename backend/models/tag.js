// backend/models/tag.js
'use strict';

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Optional: Ensures tag names are unique
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tags',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  }, {});

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Note, {
      through: 'NotesTags',
      foreignKey: 'tagId',
      otherKey: 'noteId',
      as: 'notes',
    });
    Tag.belongsTo(models.Tag, { as: 'Parent', foreignKey: 'parentId' });
    Tag.hasMany(models.Tag, { as: 'Children', foreignKey: 'parentId' });
  };

  return Tag;
};
