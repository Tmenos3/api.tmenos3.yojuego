import Player from '../../../src/models/Player';

describe('Player', () => {

  it('Cannot create with an undefined nickName', () => {
    var anUndefinedNickName;

    expect(() => new Player(anUndefinedNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME());
  });

  it('Cannot create with a null nickName', () => {
    var aNullNickName;

    expect(() => new Player(aNullNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME());
  });

  it('Cannot create with blank spaces in nickName', () => {
    var aNickNameWithBlankSpace = 'nick name';

    expect(() => new Player(aNickNameWithBlankSpace, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME_HAS_BLANKSPACES());
  });

  it('NickName must be more than 5 characters', () => {
    var aShortNickName = 'ni';

    expect(() => new Player(aShortNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME_IS_SHORT());
  });

  it('Cannot create with an undefined birthDate', () => {
    var anUndefinedBirthDate;
    expect(() => new Player('aPlayer', anUndefinedBirthDate, 'nuevo')).toThrowError(Player.INVALID_BIRTHDATE());
  });

  it('Cannot create with a null birthDate', () => {
    var aNullBirthDate = null;
    expect(() => new Player('aPlayer', aNullBirthDate, 'nuevo')).toThrowError(Player.INVALID_BIRTHDATE());
  });

  it('Cannot create with a dateBirth if it is not date type', () => {
    var anInvalidadBirthDateType = 'no soy tipo date';
    expect(() => new Player('aPlayer', anInvalidadBirthDateType, 'nuevo')).toThrowError(Player.INVALID_DATE_TYPE());
  });

  it('Cannot create with an undefined state', () => {
    var anUndefinedState;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), anUndefinedState)).toThrowError(Player.INVALID_STATE());
  });

  it('Cannot create with a null state', () => {
    var aNullState = null;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), aNullState)).toThrowError(Player.INVALID_STATE());
  });

  it('Can create a valid Player', () => {
    var aNickName = 'nickName';
    var aBirthDate = new Date(2010, 10, 10);
    var aState = 1// Player.playerStates().NEW;
    var player = new Player(aNickName, aBirthDate, aState);

    expect(player.nickName).toBe(aNickName);
    expect(player.birthDate).toBe(aBirthDate);
    expect(player.state).toBe(aState);
  });

});