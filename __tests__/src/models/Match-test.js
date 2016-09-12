import Match from '../../../src/models/Match';
import Player from '../../../src/models/Player';

describe('Match', () => {
  it('Cannot create with an undefined tittle', () => {
    var undefinedTittle;

    expect(() => new Match(undefinedTittle, new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TITTLE());
  });

  it('Cannot create with a null tittle', () => {
    var nullTittle = null;

    expect(() => new Match(nullTittle, new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TITTLE());
  });

  it('Cannot create with a undefined Date', () => {
    var undefinedDate;

    expect(() => new Match('titulo', undefinedDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  });

  it('Cannot create with a null Date', () => {
    var nullDate = null;

    expect(() => new Match('titulo', nullDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  });

  it('Cannot create with a Date if it is not Date type', () => {
    var aDate = 'No soy un tipo Date';

    expect(() => new Match('titulo', aDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE_TYPE());
  });

  it('Cannot create with an undefined from Time', () => {
    var undefinedFromTime;

    expect(() => new Match('Titulo', new Date(2010, 10, 10), undefinedFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with a null from Time', () => {
    var nullFromTime = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), nullFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with an  invalid format imput from time', () => {
    var anInvalidFormatFromTime = 'anInvalidFormatFromTime';

    expect(() => new Match('Titulo', new Date(2010, 10, 10), anInvalidFormatFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME_FORMAT());
  });

  it('Cannot create with an undefined to Time', () => {
    var undefinedToTime;

    expect(() => new Match('Titulo', new Date(2010, 10, 10), '10:00', undefinedToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with a null to Time', () => {
    var nullToTime = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', nullToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with an  invalid format imput to time', () => {
    var anInvalidFormatToTime = 'anInvalidFormatFromTime';

    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', anInvalidFormatToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME_FORMAT());
  });

  it('Cannot create with an undefined Location', () => {
    var undefinedLocation;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', undefinedLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  });

  it('Cannot create with a null Location', () => {
    var nullLocation = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', nullLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  });

  it('Cannot create with an undefined Creator', () => {
    var undefinedCreator;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', undefinedCreator)).toThrowError(Match.INVALID_CREATOR());
  });

  it('Cannot create with a Creator null', () => {
    var nullCreator = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', nullCreator)).toThrowError(Match.INVALID_CREATOR());
  });

  it('Cannot create with an undefined MatchType', () => {
    var undefinedMatchType;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', '1', undefinedMatchType)).toThrowError(Match.INVALID_MATCH_TYPE());
  });

  it('Can create a valid Match', () => {
    var aTittle = 'Título';
    var aDate = new Date(2010, 10, 10);
    var aFromTime = '18:00';
    var aToTime = '19:00';
    var aLocation = 'aLocation';
    var aCreator = 1;
    var aMatchType = 1;

    var match = new Match(aTittle, aDate, aFromTime, aToTime, aLocation, aCreator, aMatchType);

    expect(match.tittle).toBe(aTittle);
    expect(match.date).toBe(aDate);
    expect(match.fromTime).toBe(aFromTime);
    expect(match.toTime).toBe(aToTime);
    expect(match.location).toBe(aLocation);
    expect(match.creator).toBe(aCreator);
    expect(match.matchType).toBe(aMatchType);
  });
})