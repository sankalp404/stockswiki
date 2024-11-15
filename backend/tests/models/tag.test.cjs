const { expect } = require('chai');
const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-test-helpers');
const TagModel = require('../../models/tag');

describe('Tag Model', () => {
  const Tag = TagModel(sequelize, dataTypes);
  const tag = new Tag();

  // Check the model name
  checkModelName(Tag)('Tag');

  // Check the properties
  ['name', 'parentId'].forEach(checkPropertyExists(tag));

  describe('Associations', () => {
    const Note = 'some note';

    before(() => {
      Tag.associate({ Note });
    });

    it('defined a belongsToMany association with Note through NotesTags', () => {
      expect(Tag.belongsToMany).to.have.been.calledWith(Note, { through: 'NotesTags' });
    });
  });
});