import Match from '../../../src/models/Match';
import MatchComment from '../../../src/models/MatchComment';
import Player from '../../../src/models/Player';

describe('Match', () => {
  it('Cannot create with an undefined title', () => {
    let undefinedTitle;
    expect(() => new Match(undefinedTitle, new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TITLE);
  });

  it('Cannot create with a null title', () => {
    let nullTitle = null;

    expect(() => new Match(nullTitle, new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TITLE);
  });

  it('Cannot create with a undefined Date', () => {
    let undefinedDate;

    expect(() => new Match('titulo', undefinedDate, '00:00', '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_DATE);
  });

  it('Cannot create with a null Date', () => {
    let nullDate = null;

    expect(() => new Match('titulo', nullDate, '00:00', '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_DATE);
  });

  it('Cannot create with a Date if it is not Date type', () => {
    let aDate = 'invalid date type';

    expect(() => new Match('titulo', aDate, '00:00', '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_DATE_TYPE);
  });

  it('Cannot create with an undefined from Time', () => {
    let undefinedFromTime;

    expect(() => new Match('Titulo', new Date(2010, 10, 10), undefinedFromTime, '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME);
  });

  it('Cannot create with a null from Time', () => {
    let nullFromTime = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), nullFromTime, '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME);
  });

  it('Cannot create with an  invalid format imput from time', () => {
    let anInvalidFormatFromTime = 'anInvalidFormatFromTime';

    expect(() => new Match('Titulo', new Date(2010, 10, 10), anInvalidFormatFromTime, '01:00', 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME_FORMAT);
  });

  it('Cannot create with an undefined to Time', () => {
    let undefinedToTime;

    expect(() => new Match('Titulo', new Date(2010, 10, 10), '10:00', undefinedToTime, 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME);
  });

  it('Cannot create with a null to Time', () => {
    let nullToTime = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', nullToTime, 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME);
  });

  it('Cannot create with an  invalid format imput to time', () => {
    let anInvalidFormatToTime = 'anInvalidFormatFromTime';

    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', anInvalidFormatToTime, 'Lanus', 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_TIME_FORMAT);
  });

  it('Cannot create with an undefined Location', () => {
    let undefinedLocation;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', undefinedLocation, 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_LOCATION);
  });

  it('Cannot create with a null Location', () => {
    let nullLocation = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', nullLocation, 'somecreator', 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_LOCATION);
  });

  it('Cannot create with an undefined Creator', () => {
    let undefinedCreator;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', undefinedCreator, 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_CREATOR);
  });

  it('Cannot create with a Creator null', () => {
    let nullCreator = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', nullCreator, 1, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_CREATOR);
  });

  it('Cannot create with an undefined MatchType', () => {
    let undefinedMatchType;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 'somecreator', undefinedMatchType, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_MATCH_TYPE);
  });

  it('Cannot create with an null MatchType', () => {
    let nullMatchType = null;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 'somecreator', nullMatchType, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_MATCH_TYPE);
  });

  it('Cannot create with an not listed MatchType', () => {
    let notListedMatchType = 0;
    expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', 'somecreator', notListedMatchType, 'club', 'status')).toThrowError(Match.ERRORS.INVALID_MATCH_TYPE);
  });

  it('Can create a valid Match', () => {
    let aTitle = 'Título';
    let aDate = new Date(2010, 10, 10);
    let aFromTime = '18:00';
    let aToTime = '19:00';
    let aLocation = 'aLocation';
    let aCreator = 1;
    let aMatchType = Match.TYPES.FIVE;
    let aClub = 'someClub';
    let aStatus = 'someStatus';

    let match = new Match(aTitle, aDate, aFromTime, aToTime, aLocation, aCreator, aMatchType, aClub, aStatus);

    expect(match.title).toEqual(aTitle);
    expect(match.date).toEqual(aDate);
    expect(match.fromTime).toEqual(aFromTime);
    expect(match.toTime).toEqual(aToTime);
    expect(match.location).toEqual(aLocation);
    expect(match.creator).toEqual(aCreator);
    expect(match.matchType).toEqual(aMatchType);
    expect(match.club).toEqual(aClub);
    expect(match.status).toEqual(aStatus);

    expect(match.comments).toHaveLength(0);
    expect(match.confirmedPlayers).toHaveLength(0);
    expect(match.pendingPlayers).toHaveLength(0);
    expect(match.comments).toHaveLength(0);
  });

  it('Cannot invite a player if I am not a member', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    let nonMember = 'nonMember';
    expect(() => match.invitePlayer(nonMember, 'someUser')).toThrowError(Match.ERRORS.ACTION_REQUIRE_MEMBER);
  });

  it('Cannot invite a player if player id is null', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.invitePlayer('creator', null)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot invite a player if player id is undefined', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.invitePlayer('creator', undefined)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot invite the member if player id is null', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.invitePlayer(null, 'somePlayer')).toThrowError(Match.ERRORS.INVALID_MEMBER);
  });

  it('Cannot invite the member if player id is undefined', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.invitePlayer(undefined, 'somePlayer')).toThrowError(Match.ERRORS.INVALID_MEMBER);
  });

  it('Can invite a player', () => {
    let creator = 'creator';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, 'somePlayer');

    expect(match.pendingPlayers).toHaveLength(1);
  });

  it('The creator is member of the match', () => {
    let creator = 'creator';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    expect(match.isMember(creator)).toBeTruthy();
  });

  it('An invited player is a member of the match', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);

    expect(match.isMember(invited)).toBeTruthy();
  });

  it('An confirmed player is a member of the match', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.confirmPlayer(invited);

    expect(match.isMember(invited)).toBeTruthy();
  });

  it('An canceled player is a member of the match', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.cancelPlayer(invited);

    expect(match.isMember(invited)).toBeTruthy();
  });

  it('If a player is not creator or pending or confirmed or cancelled then is not a member', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(match.isMember('somePlayer')).toBeFalsy();
  });

  it('An invited player is a pending player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);

    expect(match.isPending(invited)).toBeTruthy();
  });

  it('An confirmed player is not a pending player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.confirmPlayer(invited);

    expect(match.isPending(invited)).toBeFalsy();
  });

  it('An canceled player is not a pending player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.cancelPlayer(invited);

    expect(match.isPending(invited)).toBeFalsy();
  });

  it('An invited player is not a confirmed player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);

    expect(match.isConfirmed(invited)).toBeFalsy();
  });

  it('An canceled player is not a confirmed player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.cancelPlayer(invited);

    expect(match.isConfirmed(invited)).toBeFalsy();
  });

  it('Can confirm a player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.confirmPlayer(invited);

    expect(match.isConfirmed(invited)).toBeTruthy();
  });

  it('Cannot confirm the invited if player id is null', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.confirmPlayer(null)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot confirm the invited if player id is undefined', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.confirmPlayer(undefined)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot confirm the player if it is not a pending player', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.confirmPlayer('nonPendingPlayer')).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('An invited player is not a cancelled player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);

    expect(match.isCancelled(invited)).toBeFalsy();
  });

  it('An confirmed player is not a cancelled player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.confirmPlayer(invited);

    expect(match.isCancelled(invited)).toBeFalsy();
  });

  it('Can cancel a player', () => {
    let creator = 'creator';
    let invited = 'invited';
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', creator, Match.TYPES.FIVE, 'aClub', 'aStatus');

    match.invitePlayer(creator, invited);
    match.cancelPlayer(invited);

    expect(match.isCancelled(invited)).toBeTruthy();
  });

  it('Cannot cancel if player id is null', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.cancelPlayer(null)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot cancel if player id is undefined', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.cancelPlayer(undefined)).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot cancel if it is not a pending player or a confirmed player', () => {
    let match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'creator', Match.TYPES.FIVE, 'aClub', 'aStatus');
    expect(() => match.cancelPlayer('nonPendingPlayer')).toThrowError(Match.ERRORS.INVALID_PLAYER);
  });

  it('Cannot add a comment if I am not a member', () => {
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', 'creator', Match.TYPES.FIVE);

    expect(() => match.addComment('nonMember', 'this is a match comment', new Date())).toThrowError(Match.ERRORS.ACTION_REQUIRE_MEMBER);
  });

  it('The creator can add a comment', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    match.addComment(creator, 'this is a match comment', new Date());

    expect(match.comments.length).toEqual(1);
  });

  it('A pending player can add a comment', () => {
    let creator = 'creator';
    let pending = 'pending';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    match.invitePlayer(creator, pending);
    match.addComment(pending, 'this is a match comment', new Date());

    expect(match.comments.length).toEqual(1);
  });

  it('A confirmed player can add a comment', () => {
    let creator = 'creator';
    let pending = 'pending';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    match.invitePlayer(creator, pending);
    match.confirmPlayer(pending);
    match.addComment(pending, 'this is a match comment', new Date());

    expect(match.comments.length).toEqual(1);
  });

  it('A cancelled player can add a comment', () => {
    let creator = 'creator';
    let pending = 'pending';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    match.invitePlayer(creator, pending);
    match.cancelPlayer(pending);
    match.addComment(pending, 'this is a match comment', new Date());

    expect(match.comments.length).toEqual(1);
  });

  it('When add a comment must increment id by one', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    let comment1 = match.addComment(creator, 'comment1', new Date());
    let comment2 = match.addComment(creator, 'comment2', new Date());

    expect(comment1.id).toEqual(1);
    expect(comment2.id).toEqual(2);
  });

  it('Can update a comment', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    match.addComment(creator, 'comment1', new Date());

    let newComment = 'newComment';
    match.updateComment(creator, match.comments[0].id, newComment);

    expect(match.comments[0].text).toEqual(newComment);
  });

  it('Cannot update a comment if I am not the owner', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    let comment = match.addComment(creator, 'comment1', new Date());

    expect(() => match.updateComment('nonOwner', comment.id, 'some new text')).toThrowError(Match.ERRORS.ACTION_REQUIRE_OWNER);
  });

  it('Cannot update a comment if it does not exist', () => {
    let creator = 'creator';
    let inexistentId = 1;
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);

    expect(() => match.updateComment(creator, inexistentId, 'some new text')).toThrowError(Match.ERRORS.INVALID_COMMENT);
  });

  it('Can remove a comment', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    let comment1 = match.addComment(creator, 'comment1', new Date());
    match.addComment(creator, 'comment2', new Date());

    match.removeComment(creator, comment1.id);

    expect(match.comments.length).toEqual(1);
    expect(match.comments[0].id).toEqual(2);
  });

  it('Cannot remove a comment if I am not a member', () => {
    let creator = 'creator';
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);
    let comment = match.addComment(creator, 'comment2', new Date());
    expect(() => match.removeComment('nonOwner', comment.id)).toThrowError(Match.ERRORS.ACTION_REQUIRE_OWNER);
  });

  it('Cannot remove a comment if it does not exist', () => {
    let creator = 'creator';
    let inexistentId = 1;
    let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', creator, Match.TYPES.FIVE);

    expect(() => match.removeComment(creator, inexistentId)).toThrowError(Match.ERRORS.INVALID_COMMENT);
  });
})