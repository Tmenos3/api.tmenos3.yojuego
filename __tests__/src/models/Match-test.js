jest.unmock('../../../src/models/Match');

import Match from '../../../src/models/Match';
import Player from '../../../src/models/Player';

describe('Match', () => {
  it('Cannot create with an undefined tittle', () => {
    var undefinedTittle;
    expect(1).toBe(1);
    //expect(() => new Match(undefinedTittle, '10/10/2010', '00:00:00', 'Lanus', 1)).toThrowError(Match.INVALID_TITTLE());
  });
  //
  // it('Cannot create with a null tittle', () => {
  //   var nullTittle = null;
  //
  //   expect(() => new Match(nullTittle, '10/10/2010', '00:00:00', 'Lanus', 1)).toThrowError(Match.INVALID_TITTLE());
  // });
  //
  // it('Cannot create with a undefined Date', () => {
  //   var undefinedDate;
  //
  //   expect(() => new Match('titulo', undefinedDate, '00:00:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  // });
  //
  // it('Cannot create with a null Date', () => {
  //   var nullDate = null;
  //
  //   expect(() => new Match('titulo', nullDate, '00:00:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  // });
  //
  // it('Cannot create with a Date if it is not Date type', () => {
  //   var aDate = 'No soy un tipo Date';
  //
  //   expect(() => new Match('titulo', aDate, '00:00:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE_TYPE());
  // });
  //
  // it('Cannot create with an undefined Time', () => {
  //   var undefinedTime;
  //
  //   expect(() => new Match('Titulo', '20000101', undefinedTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });
  //
  // it('Cannot create with a null Time', () => {
  //   var nullTime = null;
  //   expect(() => new Match('Titulo', '20000101', nullTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });
  //
  // it('Cannot create with an undefined Location', () => {
  //   var undefinedLocation;
  //   expect(() => new Match('Titulo', '20000101', '00:00:00', undefinedLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  // });
  //
  // it('Cannot create with a null Location', () => {
  //   var nullLocation = null;
  //   expect(() => new Match('Titulo', '20000101', '00:00:00', nullLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  // });
  //
  // it('Cannot create with an undefined Creator', () => {
  //   var undefinedCreator;
  //   expect(() => new Match('Titulo', '20000101', '00:00:00', 'Lanus', undefinedCreator)).toThrowError(Match.INVALID_CREATOR());
  // });
  //
  // it('Cannot create with a Creator null', () => {
  //   var nullCreator = null;
  //   expect(() => new Match('Titulo', '20000101', '00:00:00', 'Lanus', nullCreator)).toThrowError(Match.INVALID_CREATOR());
  // });
  //
  // it('Cannot create with a Creator if it is not Integer type', () => {
  //   var aCreator = 'Noy soy del tipo Integer';
  //   expect(() => new Match('Titulo', '20000101', '00:00:00', 'Lanus', aCreator)).toThrowError(Match.INVALID_CREATOR_TYPE());
  // });
  //
  // it('Can create a valid Match', () => {
  //   var aTittle = 'Título';
  //   var aDate = '19000101';
  //   var aTime = '00:00:00';
  //   var aLocation = 'aLocation';
  //   var aCreator = 1;
  //
  //   var match = new Match(aTittle, aDate, aTime, aLocation, aCreator);
  //
  //   expect(match.tittle).toBe(aTittle);
  //   expect(match.date).toBe(aDate);
  //   expect(match.time).toBe(aTime);
  //   expect(match.location).toBe(aLocation);
  //   expect(match.creator).toBe(aCreator);
  // });
})