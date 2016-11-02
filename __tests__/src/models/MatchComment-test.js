import MatchComment from '../../../src/models/MatchComment';

describe('MatchComment', () => {
  it('Cannot create with an undefined id', () => {
    var undefinedId;

    expect(() => new MatchComment(undefinedId, 'owner', 'text')).toThrowError(MatchComment.INVALID_ID);
  });

  it('Cannot create with an null id', () => {
    var nullId = null;

    expect(() => new MatchComment(nullId, 'owner', 'text')).toThrowError(MatchComment.INVALID_ID);
  });

  it('Cannot create with an undefined owner', () => {
    var undefinedOwner;

    expect(() => new MatchComment(1, undefinedOwner, 'text')).toThrowError(MatchComment.INVALID_OWNER);
  });

  it('Cannot create with an null owner', () => {
    var nullOwner = null;

    expect(() => new MatchComment(1, nullOwner, 'text')).toThrowError(MatchComment.INVALID_OWNER);
  });

  it('Cannot create with an undefined owner', () => {
    var undefinedText;

    expect(() => new MatchComment(1, 'owner', undefinedText)).toThrowError(MatchComment.INVALID_TEXT);
  });

  it('Cannot create with an undefined owner', () => {
    var nullText = null;

    expect(() => new MatchComment(1, 'owner', nullText)).toThrowError(MatchComment.INVALID_TEXT);
  });

  it('Cannot create with an undefined writtenOn', () => {
    var undefinedWrittenOn;

    expect(() => new MatchComment(1, 'owner', 'text', undefinedWrittenOn)).toThrowError(MatchComment.INVALID_WRITTENON);
  });

  it('Cannot create with an undefined writtenOn', () => {
    var nullWrittenOn = null;

    expect(() => new MatchComment(1, 'owner', 'text', nullWrittenOn)).toThrowError(MatchComment.INVALID_WRITTENON);
  });

  it('Cannot create with an nonDate writtenOn', () => {
    var nonDateWrittenOn = '9999-10-10T00:00:00Z';

    expect(() => new MatchComment(1, 'owner', 'text', nonDateWrittenOn)).toThrowError(MatchComment.INVALID_WRITTENON);
  });

  it('Can create a valid MatchComment', () => {
    var anId = 1;
    var anOwner = 'ioy987nhof97';
    var aText = 'this a match comment text';
    var writtenOn = new Date('2016-10-30T15:30:30Z');

    var matchComment = new MatchComment(anId, anOwner, aText, writtenOn);

    expect(matchComment.id).toEqual(anId);
    expect(matchComment.owner).toEqual(anOwner);
    expect(matchComment.text).toEqual(aText);
    expect(matchComment.writtenOn).toEqual(writtenOn);
  });
});