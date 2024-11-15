const { expect } = require('chai');
const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-test-helpers');
const sinon = require('sinon');
const UserModel = require('../../models/user');

describe('User Model', () => {
  const User = UserModel(sequelize, dataTypes);
  const user = new User();

  // Check the model name
  checkModelName(User)('User');

  // Check the properties
  [
    'email',
    'password',
    'role',
    'firstName',
    'lastName',
    'phoneNumber',
    'address',
    'state',
  ].forEach(checkPropertyExists(user));

  describe('Associations', () => {
    const Note = 'some note';
    const Tag = 'some tag';
    const Ticker = 'some ticker';

    before(() => {
      // Stub the associate method
      User.associate({ Note });
      User.associate({ Tag });
      User.associate({ Ticker });
    });

    it('defined a hasMany association with Note', () => {
      expect(User.hasMany).to.have.been.calledWith(Note, { foreignKey: 'userId', onDelete: 'CASCADE' });
    });

    it('defined a belongsToMany association with Tag', () => {
      expect(User.belongsToMany).to.have.been.calledWith(Tag, { through: 'NotesTags', foreignKey: 'userId' });
    });

    it('defined a belongsToMany association with Ticker', () => {
      expect(User.belongsToMany).to.have.been.calledWith(Ticker, { through: 'NotesTickers', foreignKey: 'userId' });
    });
  });
});