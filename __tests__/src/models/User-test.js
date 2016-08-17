jest.unmock('../../../src/models/User');

import User from '../../../src/models/User';

describe('User', () => {
  it('Cannot create with a username undefined', () => {
    var undefinedUsername;

    expect(() => new User(undefinedUsername, 'password', 'email@email.com')).toThrowError(User.INVALID_USERNAME());
  });

  it('Cannot create with a username null', () => {
    var nullUsername = null;

    expect(() => new User(nullUsername, 'password', 'email@email.com')).toThrowError(User.INVALID_USERNAME());
  });

  it('Cannot create with a password undefined', () => {
    var undefinedPassword;

    expect(() => new User('username', undefinedPassword, 'email@email.com')).toThrowError(User.INVALID_PASSWORD());
  });

  it('Cannot create with a password null', () => {
    var nullPassword = null;

    expect(() => new User('username', nullPassword, 'email@email.com')).toThrowError(User.INVALID_PASSWORD());
  });

  it('Cannot create with blank spaces in username', () => {
    var userNameWithBlankSpace = 'user name';

    expect(() => new User(userNameWithBlankSpace, 'password', 'email@email.com')).toThrowError(User.INVALID_USERNAME_HAS_BLANK_SPACE());
  });

  it('Cannot create with blank spaces in password', () => {
    var passwordWithBlankSpace = 'pass word';

    expect(() => new User('username', passwordWithBlankSpace, 'email@email.com')).toThrowError(User.INVALID_PASSWORD_HAS_BLANK_SPACE());
  });

  it('UserName must be more than 5 characters', () => {
    var aShortUsername = 'abcd';

    expect(() => new User(aShortUsername, 'aPassword', 'email@email.com')).toThrowError(User.INVALID_USERNAME_LENGHT());
  });

  it('Password must be more than 5 characters', () => {
    var aShortPassword = 'abcd';

    expect(() => new User('aUserName', aShortPassword, 'email@email.com')).toThrowError(User.INVALID_PASSWORD_LENGHT());
  });

  it('Cannot create with an email null', () => {
    var aNullemail = null;

    expect(() => new User('aUserName', 'aShortPassword', aNullemail)).toThrowError(User.INVALID_EMAIL());
  });

  it('Cannot create with an email undefined', () => {
    var anUndefinedEmail;

    expect(() => new User('aUserName', 'aShortPassword', anUndefinedEmail)).toThrowError(User.INVALID_EMAIL());
  });

  it('Password cannot be equal to username', () => {
    var username = 'username';
    var passwordEqualToUsername = username;

    expect(() => new User(username, passwordEqualToUsername, 'email@email.com')).toThrowError(User.PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME());
  });

  it('Can create a valid User', () => {
    var ausername = 'ausername';
    var apassword = 'apassword';
    var email = 'aemail';

    var user = new User(ausername, apassword, email);
    
    expect(user.username).toBe(ausername);
    expect(user.password).toBe(apassword);
    expect(user.eMail).toBe(email);
  });
});