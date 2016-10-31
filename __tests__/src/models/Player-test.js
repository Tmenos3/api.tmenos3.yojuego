import Player from '../../../src/models/Player';
import PlayerAdminState from '../../../src/constants/PlayerAdminState';

describe('Player', () => {
  it('Cannot create with an undefined nickName', () => {
    var anUndefinedNickName;

    expect(() => new Player(anUndefinedNickName)).toThrowError(Player.INVALID_NICKNAME);
  });

  it('Cannot create with a null nickName', () => {
    var aNullNickName = null;

    expect(() => new Player(aNullNickName)).toThrowError(Player.INVALID_NICKNAME);
  });

  it('Cannot create with blank spaces in nickName', () => {
    var aNickNameWithBlankSpace = 'nick name';

    expect(() => new Player(aNickNameWithBlankSpace)).toThrowError(Player.INVALID_NICKNAME_HAS_BLANKSPACES);
  });

  it('NickName must be more than 5 characters', () => {
    var aShortNickName = 'ni';

    expect(() => new Player(aShortNickName, new Date(2010, 10, 10), 'nuevo')).toThrowError(Player.INVALID_NICKNAME_IS_SHORT);
  });

  it('Cannot create with an undefined birthDate', () => {
    var anUndefinedBirthDate;
    expect(() => new Player('aPlayer', anUndefinedBirthDate)).toThrowError(Player.INVALID_BIRTHDATE);
  });

  it('Cannot create with a null birthDate', () => {
    var aNullBirthDate = null;

    expect(() => new Player('aPlayer', aNullBirthDate)).toThrowError(Player.INVALID_BIRTHDATE);
  });

  it('Cannot create with a dateBirth if it is not date type', () => {
    var anInvalidadBirthDateType = 'no soy tipo date';

    expect(() => new Player('aPlayer', anInvalidadBirthDateType)).toThrowError(Player.INVALID_DATE_TYPE);
  });

  it('Cannot create with a null state', () => {
    var aNullState = null;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), aNullState)).toThrowError(Player.INVALID_STATE);
  });

  it('Cannot create with an undefined state', () => {
    var anUndefinedState;

    expect(() => new Player('aPlayer', new Date(2010, 10, 10), anUndefinedState)).toThrowError(Player.INVALID_STATE);
  });

  it('Cannot create with an undefined adminState', () => {
    var anUndefinedAdminState;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), 'Hi, I am using Yo Juego', anUndefinedAdminState)).toThrowError(Player.INVALID_ADMIN_STATE);
  });

  it('Cannot create with a null adminState', () => {
    var anNullAdminState;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), 'Hi, I am using Yo Juego', anNullAdminState)).toThrowError(Player.INVALID_ADMIN_STATE);
  });

  it('Cannot create with a null userID', () => {
    var aNullUserID = null;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), 'Hi, I am using Yo Juego', 'adminState', aNullUserID)).toThrowError(Player.INVALID_USERID);
  });

  it('Cannot create with an undefined UserID', () => {
    var anUndefinedUser;
    expect(() => new Player('aPlayer', new Date(2010, 10, 10), 'Hi, I am using Yo Juego', 'adminState', anUndefinedUser)).toThrowError(Player.INVALID_USERID);
  });

  it('Can create a valid Player', () => {
    var aNickName = 'nickName';
    var aBirthDate = new Date(2010, 10, 10);
    var aState = 'Hi, I am using Yo Juego';
    var anAdminState = PlayerAdminState.enabled;
    var anUserID = '1';
    var player = new Player(aNickName, aBirthDate, aState, anAdminState, anUserID);

    expect(player.nickName).toBe(aNickName);
    expect(player.birthDate).toBe(aBirthDate);
    expect(player.state).toBe(aState);
    expect(player.adminState).toBe(anAdminState);
    expect(player.userid).toBe(anUserID);
    expect(player.teamMates.length).toEqual(0);
  });

  it('Can add a teammate if it does not exist', () => {
    var nonExistantTeamMateId = 'ihna8rt7q09';
    var player = new Player('aNickName', new Date(2010, 10, 10), 'aState', 'anAdminState', 'anUserID');

    player.addTeamMate(nonExistantTeamMateId);

    expect(player.teamMates.length).toEqual(1);
    expect(player.teamMates.indexOf(nonExistantTeamMateId)).toBeGreaterThanOrEqual(-1);
  });

  it('If teammate exists player does not add it again', () => {
    var existantTeamMateId = 'ihna8rt7q09';
    var player = new Player('aNickName', new Date(2010, 10, 10), 'aState', 'anAdminState', 'anUserID');

    player.addTeamMate(existantTeamMateId);
    player.addTeamMate(existantTeamMateId);

    expect(player.teamMates.length).toEqual(1);
    expect(player.teamMates.indexOf(existantTeamMateId)).toBeGreaterThanOrEqual(-1);
  });

  it('Can remove a teammate if it exists', () => {
    var existantTeamMateId = 'ihna8rt7q09';
    var player = new Player('aNickName', new Date(2010, 10, 10), 'aState', 'anAdminState', 'anUserID');

    player.addTeamMate(existantTeamMateId);

    player.removeTeamMate(existantTeamMateId);

    expect(player.teamMates.length).toEqual(0);
    expect(player.teamMates.indexOf(existantTeamMateId)).toEqual(-1);
  });

  it('If teammate does not exist player does not remove it', () => {
    var nonExistantTeamMateId = 'ihna8rt7q09';
    var player = new Player('aNickName', new Date(2010, 10, 10), 'aState', 'anAdminState', 'anUserID');

    player.removeTeamMate(nonExistantTeamMateId);
    
    expect(player.teamMates.length).toEqual(0);
    expect(player.teamMates.indexOf(nonExistantTeamMateId)).toBeGreaterThanOrEqual(-1);
  });
});