jest.unmock('../../../src/models/Player');

import Player from '../../../src/models/Player';

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

  it('Two players are equal if they have same username', () => {
    var aUsername = "aUsername";
    var playerOne = new Player(aUsername);
    var playerTwo = new Player(aUsername);

    expect(playerOne.equal(playerTwo)).toBe(true);
  });

    it('Two players are not equal if they have diferent username', () => {
    var playerOne = new Player('aUsername');
    var playerTwo = new Player('otherUsername');

    expect(playerOne.equal(playerTwo)).not.toBe(true);
  });

});