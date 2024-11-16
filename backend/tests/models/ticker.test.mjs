import { expect } from 'chai';
import { sequelize, dataTypes, checkModelName, checkPropertyExists } from 'sequelize-test-helpers';
import TickerModel from '../../models/ticker';

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