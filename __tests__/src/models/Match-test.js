jest.unmock('../../../src/models/Match');

import Match from '../../../src/models/Match';
import Player from '../../../src/models/Player';
import User from '../../../src/models/User';

describe('Match', () => {
  it('Cannot create with a Date undefined', () => {
    var undefinedDate;

    expect(() => new Match(undefinedDate, '00:00:00', 'Lanus')).toThrowError(Match.INVALID_DATE());
  });

  it('Cannot create with a Date null', () => {
    var nullDate = null;

    expect(() => new Match(nullDate, '00:00:00', 'Lanus')).toThrowError(Match.INVALID_DATE());
  });

  it('Cannot create with a Time undefined', () => {
    var undefinedTime;

    expect(() => new Match('20000101', undefinedTime, 'Lanus')).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with a Time null', () => {
    var nullTime = null;
    expect(() => new Match('20000101', nullTime, 'Lanus')).toThrowError(Match.INVALID_TIME());
  });

  it('Cannot create with a Location undefined', () => {
    var undefinedLocation;
    expect(() => new Match('20000101', '00:00:00', undefinedLocation)).toThrowError(Match.INVALID_LOCATION());
  });

  it('Cannot create with a Location null', () => {
    var nullLocation = null;
    expect(() => new Match('20000101', '00:00:00', nullLocation)).toThrowError(Match.INVALID_LOCATION());
  });

  it('Cannot create with a Creator undefined', () => {
    var undefinedCreator;
    expect(() => new Match('20000101', '00:00:00', 'Lanus', undefinedCreator)).toThrowError(Match.INVALID_CREATOR());
  });

  it('Cannot create with a Creator null', () => {
    var nullCreator = null;
    expect(() => new Match('20000101', '00:00:00', 'Lanus', nullCreator)).toThrowError(Match.INVALID_CREATOR());
  });

  it('Cannot add a players undefined', () => {
    var anUndefinedPlayer;
    var match = new Match('19000101', '00:00:00', 'aLocation', new User('aUserName', 'aShortPassword', 'qqq@qqq.com'));

    expect(() => match.addPlayer(anUndefinedPlayer)).toThrowError(Match.INVALID_PLAYER());
  });

  it('Cannot add a players null', () => {
    var aNullPlayer = null;
    var match = new Match('19000101', '00:00:00', 'aLocation', new User('aUserName', 'aShortPassword', 'email@email.com'));

    expect(() => match.addPlayer(aNullPlayer)).toThrowError(Match.INVALID_PLAYER());
  });

  it('Cannot remove a players undefined', () => {
    var anUndefinedPlayer;
    var match = new Match('19000101', '00:00:00', 'aLocation', new User('aUserName', 'aShortPassword', 'email@email.com'));

    expect(() => match.removePlayer(anUndefinedPlayer)).toThrowError(Match.INVALID_PLAYER());
  });

  it('Cannot remove a players null', () => {
    var aNullPlayer = null;
    var match = new Match('19000101', '00:00:00', 'aLocation', new User('aUserName', 'aShortPassword', 'email@email.com'));

    expect(() => match.removePlayer(aNullPlayer)).toThrowError(Match.INVALID_PLAYER());
  });

  it('Can create a valid Match', () => {
    var aDate = '19000101';
    var aTime = '00:00:00';
    var aLocation = 'aLocation';
    var aUser = new User('aUsername', 'aPassword', 'email@email.com');

    var match = new Match(aDate, aTime, aLocation, aUser);

    expect(match.date).toBe(aDate);
    expect(match.time).toBe(aTime);
    expect(match.location).toBe(aLocation);
    expect(match.creator.equal(aUser)).toBe(true);
  });

  it('Can add a valid player', () => {
    var aDate = '19000101';
    var aTime = '00:00:00';
    var aLocation = 'aLocation';
    var aUser = new User('aUsername', 'aPassword', 'email@email.com');
    var aPlayer = new Player('nickName', 1);
    var match = new Match(aDate, aTime, aLocation, aUser);

    match.addPlayer(aPlayer);
    expect(match.date).toBe(aDate);
    expect(match.time).toBe(aTime);
    expect(match.location).toBe(aLocation);
    expect(match.creator.equal(aUser)).toBe(true);
    expect(match.players[0].equal(aPlayer)).toBe(true);
    expect(match.players.length).toBe(1);
  });

  it('Can remove a valid player', () => {
    var aDate = '19000101';
    var aTime = '00:00:00';
    var aLocation = 'aLocation';
    var aUser = new User('aUsername', 'aPassword', 'aEMail@email.com');
    var aPlayer = new Player('nickName', 1);
    var match = new Match(aDate, aTime, aLocation, aUser);

    match.addPlayer(aPlayer);
    match.removePlayer(aPlayer);
    expect(match.date).toBe(aDate);
    expect(match.time).toBe(aTime);
    expect(match.location).toBe(aLocation);
    expect(match.creator.equal(aUser)).toBe(true);
    expect(match.players.length).toBe(0);
  });
})