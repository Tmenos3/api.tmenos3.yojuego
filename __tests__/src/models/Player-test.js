jest.unmock('../../../src/models/Player');

import Player from '../../../src/models/Player';

describe('Player', () => {
  it('Cannot create with a username undefined', () => {
    var undefinedUsername;
    // var aPassword = "aPassword";
    // var aEMail = "aEMail";
    // expect(() => new Player(undefinedUsername, aPassword, aEMail)).toThrowError(Player.INVALID_USERNAME());

    expect(() => new Player(undefinedUsername, 'aPassword', 'aEMail')).toThrowError(Player.INVALID_USERNAME());
  });

  it('Cannot create with a username null', () => {
    var nullUsername = null;

    expect(() => new Player(nullUsername, 'aPassword', 'aEMail')).toThrowError(Player.INVALID_USERNAME())
  });

  it('Cannot create with a password undefined', () => {
    var undefinedPassword;

    expect(() => new Player('aUsername', undefinedPassword, 'aEMail')).toThrowError(Player.INVALID_PASSWORD()) 
  });

  it('Cannot create with a password null', () => {
    var nullPassword = null;

    expect(() => new Player('aUserName', nullPassword, 'aEMail')).toThrowError(Player.INVALID_PASSWORD())
  });

  it('Cannot create with an eMail undefined', () => {
    //var aEMAil;
    var undefinedMail;

    expect(() => new Player('aUserName', 'aPassword', undefinedMail)).toThrowError(Player.INVALID_EAMIL())
  });

  it('Cannot create with an eMail null', () => {
    //var aEMAil = null;
    var nullMail = null;

    expect(() => new Player('aUserName', 'aPassword', nullMail)).toThrowError(Player.INVALID_EAMIL())
  });

  it('Cannot create with blank spaces in userName', () => {
    var aUsernameWithBlankSpace = "aUse rname";

    expect(() => new Player(aUsernameWithBlankSpace, 'aPassword', 'aEMail').toThrowError(Palyer.INVALID_USERNAMEWITHBLANKSPACE()))
  });

  it('Cannot be less 5 character less', () => {
      //lo hacemos pinchar para que no nos olvidemos que esta,
      //que pinche nos va a ogligar a no perderlo de vista
      expect(false).toBe(true);
  });

  it('Can create a valid Player', () => {
    var aUsername = "aUsername";
    var aPassword = "aPassword";
    var aEMail = "aEMail";
    var player = new Player(aUsername, aPassword, aEMail);

    //Aca falta algo!
    expect(player.username).toBe(aUsername);
    //faltarian los expect del mail y del pass
  });

  it('Two players are equal if they have same username', () => {
    var aUsername = "aUsername";
    var aPassword = "aPassword";
    var aEMail = "aEMail";
    var playerOne = new Player(aUsername, aPassword, aEMail);
    var playerTwo = new Player(aUsername, aPassword, aEMail);

    expect(playerOne.equal(playerTwo)).toBe(true); 
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