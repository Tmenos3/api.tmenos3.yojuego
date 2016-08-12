jest.unmock('../../../src/models/PlayerProfile');

import PlayerProfile from '../../../src/models/PlayerProfile';

describe('PlayerProfile', () => {
  it('Cannot create with a nickname undefined', () => {
    var undefinedNickname;

    expect(() => new PlayerProfile(undefinedNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  });

  it('Cannot create with a nickname null', () => {
    var nullNickname = null;

    expect(() => new PlayerProfile(nullNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  });

  it('Can create with a PlayerProfile', () => {
    var nickname = 'nickname';
    var playerProfile = new PlayerProfile(nickname);

    expect(playerProfile.nickname).toBe(nickname);
  });

  it('Can change nickname', () => {
    var oldNickname = 'oldNickname';
    var newNickname = 'newNickname';
    var playerProfile = new PlayerProfile(oldNickname);

    playerProfile.changeNickname(newNickname);

    expect(playerProfile.nickname).toBe(newNickname);
  });

  it('Cannot change nickname if it is undefined', () => {
    var undefinedNickname;
    var playerProfile = new PlayerProfile('aNickname');

    expect(() => playerProfile.changeNickname(undefinedNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  });

  it('Cannot change nickname if it is null', () => {
    var nullNickname = null;
    var playerProfile = new PlayerProfile('aNickname');

    expect(() => playerProfile.changeNickname(nullNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  });
});