jest.unmock('../../../src/models/User');

import User from '../../../src/models/User';

describe('User', () => {
  it('Cannot create with a username undefined', () => {
    var undefinedUsername;

    expect(() => new User(undefinedUsername, 'password')).toThrowError(User.INVALID_USERNAME());
  });

  it('Cannot create with a username null', () => {
    var nullUsername = null;

    expect(() => new User(nullUsername, 'password')).toThrowError(User.INVALID_USERNAME());
  });

  it('Cannot create with a password undefined', () => {
    var undefinedPassword;

    expect(() => new User('username', undefinedPassword)).toThrowError(User.INVALID_PASSWORD());
  });

  it('Cannot create with a password null', () => {
    var nullPassword = null;

    expect(() => new User('username', nullPassword)).toThrowError(User.INVALID_PASSWORD());
  });

  it('Password cannot be equal to username', () => {
    var username = 'username';
    var passwordEqualToUsername = username;

    expect(() => new User(username, passwordEqualToUsername)).toThrowError(User.PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME());
  });
});