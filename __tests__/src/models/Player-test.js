jest.unmock('../../../src/models/Player');

import Player from '../../../src/models/Player';

describe('Player', () => {
  it('Cannot create with a username undefined', () => {
    var undefinedUsername;

    expect(() => new Player(undefinedUsername, 'aPassword', 'aEMail')).toThrowError(Player.INVALID_USERNAME());
  });

  it('Cannot create with a username null', () => {
    var nullUsername = null;

    expect(() => new Player(nullUsername, 'aPassword', 'aEMail')).toThrowError(Player.INVALID_USERNAME());
  });

  it('Cannot create with a password undefined', () => {
    var undefinedPassword;

    expect(() => new Player('aUsername', undefinedPassword, 'aEMail')).toThrowError(Player.INVALID_PASSWORD());
  });

  it('Cannot create with a password null', () => {
    var nullPassword = null;

    expect(() => new Player('aUserName', nullPassword, 'aEMail')).toThrowError(Player.INVALID_PASSWORD());
  });

  it('Cannot create with an eMail undefined', () => {
    //var aEMAil;
    var undefinedMail;

    expect(() => new Player('aUserName', 'aPassword', undefinedMail)).toThrowError(Player.INVALID_EAMIL());
  });

  it('Cannot create with an eMail null', () => {
    //var aEMAil = null;
    var nullMail = null;

    expect(() => new Player('aUserName', 'aPassword', nullMail)).toThrowError(Player.INVALID_EAMIL());
  });

  it('Cannot create with blank spaces in userName', () => {
    var aUsernameWithBlankSpace = "aUse rname";

    expect(() => new Player(aUsernameWithBlankSpace, 'aPassword', 'aEMail').toThrowError(Palyer.INVALID_USERNAMEWITHBLANKSPACE()));
  });

  it('Cannot be less 5 character', () => {
      //lo hacemos pinchar para que no nos olvidemos que esta,
      //que pinche nos va a ogligar a no perderlo de vista
    expect(false).toBe(true);
    expect(() => new Player(aUsernameWithBlankSpace, aPassword, aEMail).toThrowError(Palyer.INVALID_STRING_HAD_BLANK_SPACE()))
  });

  it('UserName must be more than 5 characters', () => {
    var aUserName = "aU";
    var aPassword = "aPassword";
    var aEMail = "aEMail";

    expect(() => new Player(aUserName, aPassword, aEMail).toThrowError(Palyer.INVALID_USERNAME_LENGHT()));
  });

  it('Password must be more than 5 characters', () => {
    var aUserName = "aUserName";
    var aPassword = "aP";
    var aEMAil = "aEMAil";

    expect(() => new Player(aUserName, aPassword, aEMail).toThrowError(Palyer.INVALID_USERNAME_LENGHT()));
  });

  it('Can create a valid Player', () => {
    var aUsername = "aUsername";
    var aPassword = "aPassword";
    var aEMail = "aEMail";
    var aplayer = new Player(aUsername, aPassword, aEMail);

    expect(aplayer.username).toBe(aUsername);
    expect(aplayer.password).toBe(aPassword);
    expect(aplayer.eMail).toBe(aEMail);
  });

  it('Two players are equal if they have same username', () => {
    var aUsername = "aUsername";
    var aPassword = "aPassword";
    var aEMail = "aEMail";
    var playerOne = new Player(aUsername, aPassword, aEMail);
    var playerTwo = new Player(aUsername, aPassword, aEMail);

    expect(playerOne.equal(playerTwo)).toBe(true); 
  });

  it('UserName and password cannot be the same', () => {
    var aUsername = "sameString";
    var aPassword = "sameString";
    var aEMail = "aEMail";
   
    expect(() => new Player(aUserName, aPassword, aEMail).toThrowError(Palyer.USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS()));
  });

  it('Two players are not equal if they have diferent username', () => {
    var aUsername = "aUsername";
    var aOtherUserName = "aOtherUserName";
    var aPassword = "aPassword";
    var aEMail = "aEMail";

    var playerOne = new Player(aUsername, aPassword, aEMail);
    var playerTwo = new Player(aOtherUserName,aPassword, aEMail);

    expect(playerOne.equal(playerTwo)).not.toBe(true);
  });
});