jest.unmock('../src/Player');

import Player from '../src/Player';

describe('Player', () => {
  it('Cannot create with a username undefined', () => {
    var undefinedUsername;
    expect(() => new Player(undefinedUsername)).toThrowError(Player.INVALID_USERNAME())
  });

  it('Cannot create with a username null', () => {
    var nullUsername = null;
    expect(() => new Player(nullUsername)).toThrowError(Player.INVALID_USERNAME())
  });

  it('Can create a valid Player', () => {
    var aUsername = "aUsername";
    var player = new Player(aUsername);

    expect(player.username).toBe(aUsername);
  });
});