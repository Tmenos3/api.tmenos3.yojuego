import Invitation from '../../../src/models/Invitation';

describe('Invitation', () => {
  it('Cannot create with an undefined Sender', () => {
    var undefinedSender;

    expect(() => new Invitation(undefinedSender, 2, 1)).toThrowError(Invitation.INVALID_SENDER);
  });

  it('Cannot create with a null Sender', () => {
    var nullSender = null;

    expect(() => new Invitation(nullSender, 2, 1)).toThrowError(Invitation.INVALID_SENDER);
  });

  it('Cannot create with an undefined recipient', () => {
    var undefinedRecipient;

    expect(() => new Invitation(1, undefinedRecipient, 1)).toThrowError(Invitation.INVALID_RECIPIENT);
  });

  it('Cannot create with a null recipient', () => {
    var nullRecipient = null;

    expect(() => new Invitation(1, nullRecipient, 1)).toThrowError(Invitation.INVALID_RECIPIENT);
  });

  it('Cannot create with an undefined Match', () => {
    var anUndefinedMatch;

    expect(() => new Invitation(1, 2, anUndefinedMatch)).toThrowError(Invitation.INVALID_MATCH);
  });

  it('Cannot create with a null Match', () => {
    var aNullMatch = null;

    expect(() => new Invitation(1, 2, aNullMatch)).toThrowError(Invitation.INVALID_MATCH);
  });

  it('Can create a valid Invitation', () => {
    var aSender = 1;
    var aRecipient = 2;
    var aMatch = 1;

    var aInvitation = new Invitation(aSender, aRecipient, aMatch);

    expect(aInvitation.sender).toBe(aSender);
    expect(aInvitation.recipient).toBe(aRecipient);
    expect(aInvitation.match).toBe(aMatch);
  });
});