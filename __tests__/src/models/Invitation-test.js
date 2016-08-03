jest.unmock('../../../src/models/Invitation');

import Invitation from '../../../src/models/Invitation';
import Player from '../../../src/models/Player';

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