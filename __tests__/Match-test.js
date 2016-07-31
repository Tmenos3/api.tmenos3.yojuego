jest.unmock('../src/Match');

import Match from '../src/Match';

describe('Match', () => {
  it('Cannot create with a Date undefined', () => {
    var undefinedDate;
  
    expect(() => new Match(undefinedDate, '00:00:00', 'Lanus')).toThrowError(Match.INVALID_DATE())
  });

 it('Cannot create with a Date null', () => {
    var nullDate = null;
   
    expect(() => new Match(nullDate, '00:00:00', 'Lanus')).toThrowError(Match.INVALID_DATE())
  });

   it('Cannot create with a Time undefined', () => {
    var undefinedTime;
  
    expect(() => new Match('20000101', undefinedTime, 'Lanus')).toThrowError(Match.INVALID_TIME())
  });

 it('Cannot create with a Time null', () => {
    var nullTime = null;
    expect(() => new Match('20000101', nullTime, 'Lanus')).toThrowError(Match.INVALID_TIME())
  });

it('Cannot create with a Location undefined', () => {
    var undefinedLocation;
    expect(() => new Match('20000101', '00:00:00', undefinedLocation)).toThrowError(Match.INVALID_LOCATION())
  });

 it('Cannot create with a Location null', () => {
    var nullLocation = null;
    expect(() => new Match('20000101', '00:00:00',nullLocation)).toThrowError(Match.INVALID_LOCATION())
  });

  it('Can create a valid Match', () => {
    var aDate = '19000101';
    var aTime = '00:00:00';
    var aLocation = 'lanus';
    var match = new Match(aDate, aTime, aLocation);

    expect(match.date).toBe(aDate);
    expect(match.time).toBe(aTime);
    expect(match.location).toBe(aLocation);
  });
});