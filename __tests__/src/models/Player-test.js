import Player from '../../../src/models/Player';

describe('Player', () => {
  it('Cannot create with an undefined id', () => {
    var undefinedId;

    expect(() => new Player(undefinedId, 'nickname', new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_ID);
  });

  it('Cannot create with a null id', () => {
    var nullId = null;

    expect(() => new Player(nullId, 'nickname', new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_ID);
  });

  it('Cannot create with an undefined nickName', () => {
    var anUndefinedNickName;

    expect(() => new Player('id', anUndefinedNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME);
  });

  it('Cannot create with a null nickName', () => {
    var aNullNickName = null;

    expect(() => new Player('id', aNullNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME);
  });

  it('Cannot create with blank spaces in nickName', () => {
    var aNickNameWithBlankSpace = 'nick name';

    expect(() => new Player('id', aNickNameWithBlankSpace, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME_HAS_BLANKSPACES);
  });

  it('NickName must be more than 5 characters', () => {
    var aShortNickName = 'ni';

    expect(() => new Player('id', aShortNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME_IS_SHORT);
  });

  it('Cannot create with an undefined birthDate', () => {
    var anUndefinedBirthDate;
    expect(() => new Player('id', 'aPlayer', anUndefinedBirthDate, 'nuevo')).toThrowError(Player.INVALID_BIRTHDATE);
  });

  it('Cannot create with a null birthDate', () => {
    var aNullBirthDate = null;
    expect(() => new Player('id', 'aPlayer', aNullBirthDate, 'nuevo')).toThrowError(Player.INVALID_BIRTHDATE);
  });

  it('Cannot create with a dateBirth if it is not date type', () => {
    var anInvalidadBirthDateType = 'no soy tipo date';
    expect(() => new Player('id', 'aPlayer', anInvalidadBirthDateType, 'nuevo')).toThrowError(Player.INVALID_DATE_TYPE);
  });

  it('Cannot create with an undefined state', () => {
    var anUndefinedState;
    expect(() => new Player('id', 'aPlayer', new Date(2010, 10, 10), anUndefinedState)).toThrowError(Player.INVALID_STATE);
  });

  it('Cannot create with a null state', () => {
    var aNullState = null;
    expect(() => new Player('id', 'aPlayer', new Date(2010, 10, 10), aNullState)).toThrowError(Player.INVALID_STATE);
  });

  it('Can create a valid Player', () => {
    var id = 'playerId';
    var aNickName = 'nickName';
    var aBirthDate = new Date(2010, 10, 10);
    var aState = 1;// Player.playerStates().NEW;
    var player = new Player(id, aNickName, aBirthDate, aState);

    expect(player.id).toBe(id);
    expect(player.nickName).toBe(aNickName);
    expect(player.birthDate).toBe(aBirthDate);
    expect(player.state).toBe(aState);
  });

});