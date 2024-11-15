// models/tag.js
'use strict';

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Note, { through: 'NotesTags', foreignKey: 'tagId' });
  };

  return Tag;
};
