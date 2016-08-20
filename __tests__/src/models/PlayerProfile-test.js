jest.unmock('../../../src/models/PlayerProfile');

import PlayerProfile from '../../../src/models/PlayerProfile';

describe('PlayerProfile', () => {
  it('Cannot create with a playerID undefined', () => {
    var undefinedPlayerProfile;

    expect(() => new PlayerProfile(undefinedPlayerProfile)).toThrowError(PlayerProfile.INVALID_PALYERID());
  });

  it('Cannot create with a playerID null', () => {
    var nullPlayerProfile = null;

    expect(() => new PlayerProfile(nullPlayerProfile)).toThrowError(PlayerProfile.INVALID_PALYERID());
  });

  it('Cannot create with a playerProfile distinct of int', () => {
    var aPlayerProfile = '1';
    expect(() => new PlayerProfile(aPlayerProfile)).toThrowError(PlayerProfile.INVALID_PALYERID());
  });

  it('Can create  a PlayerProfile', () => {
    var playerID = 1;
    var playerProfile = new PlayerProfile(playerID);

    expect(playerProfile.playerID).toBe(playerID);
  });
});