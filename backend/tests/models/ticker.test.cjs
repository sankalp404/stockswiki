const { expect } = require('chai');
const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-test-helpers');
const TickerModel = require('../../models/ticker');

describe('Ticker Model', () => {
  const Ticker = TickerModel(sequelize, dataTypes);
  const ticker = new Ticker();

  // Check the model name
  checkModelName(Ticker)('Ticker');

  // Check the properties
  ['symbol', 'companyName', 'price'].forEach(checkPropertyExists(ticker));

  describe('Associations', () => {
    const Note = 'some note';

    before(() => {
      Ticker.associate({ Note });
    });

    it('defined a belongsToMany association with Note through NotesTickers', () => {
      expect(Ticker.belongsToMany).to.have.been.calledWith(Note, { through: 'NotesTickers' });
    });
  });
});