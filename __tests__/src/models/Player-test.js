jest.unmock('../../../src/models/Player');

import Player from '../../../src/models/Player';

describe('Player', () => {

  it('Cannot create with an undefined nickName', () => {
    var anUndefinedNickName;

    expect(() => new Player(anUndefinedNickName)).toThrowError(Player.INVALID_NICKNAME());
  });

  it('Cannot create with a null nickName', () => {
    var aNullNickName;

    expect(() => new Player(aNullNickName)).toThrowError(Player.INVALID_NICKNAME());
  });

  it('Cannot create with blank spaces in nickName', () => {
    var aNickNameWithBlankSpace = 'nick name';

    expect(() => new Player(aNickNameWithBlankSpace)).toThrowError(Player.INVALID_NICKNAME_HAS_BLANKSPACES());
  });

  it('NickName must be more than 5 characters', () => {
    var aShortNickName = 'ni';

    expect(() => new Player(aShortNickName)).toThrowError(Player.INVALID_NICKNAME_IS_SHORT());
  });

  it('Cannot create with an undefined user', () => {
    var anUndefinedUser;

    expect(() => new Player('aNickName', anUndefinedUser)).toThrowError(Player.INVALID_USER());
  });

  it('Cannot create with a null user', () => {
    var aNullUser;

    expect(() => new Player('aNickName', aNullUser)).toThrowError(Player.INVALID_USER());
  });

  it('Cannot create with a user distinct of int', () => {
    var anUser = 'aaaaaaa';
    expect(() => new Player('aNickName', anUser)).toThrowError(Player.INVALID_USER_TYPE());
  });

  it('Can create a valid Player', () => {
    var aNickName = 'nickName';
    var aUserId = 1;
    var player = new Player(aNickName, aUserId);

    expect(player.nickName).toBe(aNickName);
    expect(player.userID).toBe(aUserId);
  });

  /////
  //it('Can change nickname', () => {
  //  var oldNickname = 'oldNickname';
  //  var newNickname = 'newNickname';
  //  var playerProfile = new PlayerProfile(oldNickname);
  //
  //  playerProfile.changeNickname(newNickname);
  //
  //  expect(playerProfile.nickname).toBe(newNickname);
  //});
  //
  //it('Cannot change nickname if it is undefined', () => {
  //  var undefinedNickname;
  //  var playerProfile = new PlayerProfile('aNickname');
  //
  //  expect(() => playerProfile.changeNickname(undefinedNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  //});
  //
  //it('Cannot change nickname if it is null', () => {
  //  var nullNickname = null;
  //  var playerProfile = new PlayerProfile('aNickname');
  //
  //  expect(() => playerProfile.changeNickname(nullNickname)).toThrowError(PlayerProfile.INVALID_NICKNAME());
  //});
});