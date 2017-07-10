import Player from '../../../src/models/Player';

describe('Player', () => {
  it('Cannot create with an undefined first name', () => {
    let undefinedFirstName;

    expect(() => new Player(undefinedFirstName, 'lastName', 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot create with a null first name', () => {
    let aNullFirstName = null;

    expect(() => new Player(aNullFirstName, 'lastName', 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot create with an empty first name', () => {
    let emptyFirstName = '';

    expect(() => new Player(emptyFirstName, 'lastName', 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot create with an undefined last name', () => {
    let undefinedLastName;

    expect(() => new Player('firstName', undefinedLastName, 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot create with a null last name', () => {
    let aNullLastName = null;

    expect(() => new Player('firstName', aNullLastName, 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot create with an empty last name', () => {
    let emptyLastName = '';

    expect(() => new Player('firstName', emptyLastName, 'nickName', 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot create with an undefined nick name', () => {
    let undefinedNickName;

    expect(() => new Player('firstName', 'lastName', undefinedNickName, 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot create with a null nick name', () => {
    let aNullNickName = null;

    expect(() => new Player('firstName', 'lastName', aNullNickName, 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot create with an empty nick name', () => {
    let emptyNickName = '';

    expect(() => new Player('firstName', 'lastName', emptyNickName, 'userid', 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot create with a null userID', () => {
    let aNullUserID = null;
    expect(() => new Player('firstName', 'lastName', 'nickName', aNullUserID, 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_USERID);
  });

  it('Cannot create with an undefined UserID', () => {
    let anUndefinedUser;
    expect(() => new Player('firstName', 'lastName', 'nickName', anUndefinedUser, 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_USERID);
  });

  it('Cannot create with an empty UserID', () => {
    let emptyUserId = '';
    expect(() => new Player('firstName', 'lastName', 'nickName', emptyUserId, 'mail@mail.com')).toThrowError(Player.ERRORS.INVALID_USERID);
  });

  it('Cannot create with a null email', () => {
    let aNullEmail = null;
    expect(() => new Player('firstName', 'lastName', 'nickName', 'userid', aNullEmail)).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot create with an undefined email', () => {
    let anUndefinedEmail;
    expect(() => new Player('firstName', 'lastName', 'nickName', 'userid', anUndefinedEmail)).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot create with an empty email', () => {
    let emptyEmail = '';
    expect(() => new Player('firstName', 'lastName', 'nickName', 'userid', emptyEmail)).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot create with an bad formatted email', () => {
    expect(() => new Player('firstName', 'lastName', 'nickName', 'userid', 'badFormattedEmail')).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Can create a valid Player', () => {
    let firstName = 'firstName';
    let lastName = 'lastName';
    let nickName = 'nickName';
    let userId = 'userId';
    let email = 'mail@mail.com';
    let player = new Player(firstName, lastName, nickName, userId, email);

    expect(player.firstName).toBe(firstName);
    expect(player.lastName).toBe(lastName);
    expect(player.nickName).toBe(nickName);
    expect(player.userid).toBe(userId);
    expect(player.email).toBe(email);
    expect(player.phone).toBeNull();
    expect(player.photo).toBeNull();
  });

  it('Cannot set a new first name to undefined', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setFirstName(undefined)).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot set a new first name to null', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setFirstName(null)).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot set a new first name to empty', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setFirstName('')).toThrowError(Player.ERRORS.INVALID_FIRSTNAME);
  });

  it('Cannot set a new last name to undefined', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setLastName(undefined)).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot set a new last name to null', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setLastName(null)).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot set a new last name to empty', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setLastName('')).toThrowError(Player.ERRORS.INVALID_LASTNAME);
  });

  it('Cannot set a new nick name to undefined', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setNickName(undefined)).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot set a new nick name to null', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setNickName(null)).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot set a new nick name to empty', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setNickName('')).toThrowError(Player.ERRORS.INVALID_NICKNAME);
  });

  it('Cannot set a new email to undefined', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setEmail(undefined)).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot set a new email to null', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setEmail(null)).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot set a new email to empty', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setEmail('')).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Cannot set a new email with an invalid format', () => {
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    expect(() => player.setEmail('badFormattedEmail')).toThrowError(Player.ERRORS.INVALID_EMAIL);
  });

  it('Can set a new first name', () => {
    let newFirstName = 'newFirstName';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setFirstName(newFirstName);

    expect(player.firstName).toBe(newFirstName);
  });

  it('Can set a new last name', () => {
    let newLastName = 'newLastName';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setLastName(newLastName);

    expect(player.lastName).toBe(newLastName);
  });

  it('Can set a new nick name', () => {
    let newNickName = 'newNickName';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setNickName(newNickName);

    expect(player.nickName).toBe(newNickName);
  });

  it('Can set a new email', () => {
    let newEmail = 'new_email@mail.com';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setEmail(newEmail);

    expect(player.email).toBe(newEmail);
  });

  it('Can set a new photo', () => {
    let newPhoto = 'newPhoto';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setPhoto(newPhoto);

    expect(player.photo).toBe(newPhoto);
  });

  it('Can set a phone', () => {
    let newPhone = 'newPhone';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
    player.setPhone(newPhone);

    expect(player.phone).toBe(newPhone);
  });

  it('Can create a valid Player with photo and phone', () => {
    let photo = 'myPhoto';
    let phone = 'myPhone';
    let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com', photo, phone);

    expect(player.phone).toBe(phone);
    expect(player.photo).toBe(photo);
  });
});