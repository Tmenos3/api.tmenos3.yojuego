jest.unmock('../src/Invitation');

import Invitation from '../src/Invitation';
import Player from '../src/Player';

describe('Invitation', () => {
  it('Cannot create with a Sender undefined', () => {
    var undefinedSender;
  
    expect(() => new Invitation(undefinedSender)).toThrowError(Invitation.INVALID_SENDER())
  });

 it('Cannot create with a Sender null', () => {
    var nullSender = null;
   
    expect(() => new Invitation(nullSender)).toThrowError(Invitation.INVALID_SENDER())
  });

  it('Can create a valid Invitation', () => {
    var aSender = new Player('aUsername');
    var invitation = new Invitation(aSender);

    expect(invitation.sender).toBe(aSender);
  });
});