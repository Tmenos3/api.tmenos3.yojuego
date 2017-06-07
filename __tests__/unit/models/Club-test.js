import Club from '../../../src/models/Club/Club';

describe('Club', () => {
  it('Can create a valid Club', () => {
    let aName = 'unClub';
    let aDescription = 'unaDescipcion';
    let facilities = [Club.FACILITY_MEN_SHOWERS, Club.FACILITY_MEN_LOCKER_ROOM];
    let aValidAllowOnlineBooking = true;
    let aValidAllowOnlinePayment = true;
    
    let aClub = new Club(aName, aDescription, facilities, aValidAllowOnlineBooking, aValidAllowOnlinePayment);
    expect(aClub).toBeDefined();
    expect(aClub.name).toBe(aName);
    expect(aClub.description).toBe(aDescription);
    expect(aClub.facilities).toContain(Club.FACILITY_MEN_SHOWERS);
    expect(aClub.facilities).toContain(Club.FACILITY_MEN_LOCKER_ROOM);
    expect(aClub.allowOnlineBooking).toBe(aValidAllowOnlineBooking);
    expect(aClub.allowOnlinePayment).toBe(aValidAllowOnlinePayment);
  });

  it('Cannot create with an undefined name', () => {
    let undefinedName;

    expect(() => new Club(undefinedName)).toThrowError(Club.INVALID_NAME);
  });

  it('Cannot create with a null name', () => {
    let nullName = null;

    expect(() => new Club(nullName)).toThrowError(Club.INVALID_NAME);
  });

  it('Cannot create with an invalid name', () => {
    let invalidName = '    ';

    expect(() => new Club(invalidName, 'description')).toThrowError(Club.INVALID_NAME);
  });

  it('Cannot create with an undefined description', () => {
    let undefinedDescription;

    expect(() => new Club('name', undefinedDescription)).toThrowError(Club.INVALID_DESCRIPTION);
  });

  it('Cannot create with an null description', () => {
    let nullDescription = null;

    expect(() => new Club('name', nullDescription)).toThrowError(Club.INVALID_DESCRIPTION);
  });

  it('Cannot create with an invalid description', () => {
    let invalidDescription = '    ';

    expect(() => new Club('name', invalidDescription)).toThrowError(Club.INVALID_DESCRIPTION);
  });

  it('Cannot create with invalid facilities', () => {
    let invalidFacilities = ' ';

    expect(() => new Club('name', 'description', invalidFacilities)).toThrowError(Club.INVALID_FACILITIES);
  });

  it('Cannot create with invalid facilities', () => {
    let invalidFacilities = [Club.FACILITY_MEN_LOCKER_ROOM, 'nkjbkj', Club.FACILITY_MEN_SHOWERS];

    expect(() => new Club('name', 'description', invalidFacilities)).toThrowError(Club.INVALID_FACILITIES);
  });

  it('Cannot create with undefined allowOnLineBooking', () => {
    let invalidAllowOnLineBooking;

    expect(() => new Club('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Club.INVALID_ALLOW_ONLINE_BOOKING);
  });

  it('Cannot create with null allowOnLineBooking', () => {
    let invalidAllowOnLineBooking = null;

    expect(() => new Club('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Club.INVALID_ALLOW_ONLINE_BOOKING);
  });

  it('Cannot create with invalid allowOnLineBooking', () => {
    let invalidAllowOnLineBooking = 'asdas';

    expect(() => new Club('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Club.INVALID_ALLOW_ONLINE_BOOKING);
  });

  it('Cannot create with undefined allowOnlinePayment', () => {
    let invalidAllowOnlinePayment;

    expect(() => new Club('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Club.INVALID_ALLOW_ONLINE_PAYMENT);
  });

  it('Cannot create with null allowOnlinePayment', () => {
    let invalidAllowOnlinePayment = null;

    expect(() => new Club('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Club.INVALID_ALLOW_ONLINE_PAYMENT);
  });


  it('Cannot create with invalid allowOnlinePayment', () => {
    let invalidAllowOnlinePayment = 'asdas';

    expect(() => new Club('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Club.INVALID_ALLOW_ONLINE_PAYMENT);
  });

  // it('Cannot create with a undefined Date', () => {
  //   var undefinedDate;

  //   expect(() => new Match('titulo', undefinedDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  // });

  // it('Cannot create with a null Date', () => {
  //   var nullDate = null;

  //   expect(() => new Match('titulo', nullDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE());
  // });

  // it('Cannot create with a Date if it is not Date type', () => {
  //   var aDate = 'No soy un tipo Date';

  //   expect(() => new Match('titulo', aDate, '00:00', '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_DATE_TYPE());
  // });

  // it('Cannot create with an undefined from Time', () => {
  //   var undefinedFromTime;

  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), undefinedFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });

  // it('Cannot create with a null from Time', () => {
  //   var nullFromTime = null;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), nullFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });

  // it('Cannot create with an  invalid format imput from time', () => {
  //   var anInvalidFormatFromTime = 'anInvalidFormatFromTime';

  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), anInvalidFormatFromTime, '01:00', 'Lanus', 1)).toThrowError(Match.INVALID_TIME_FORMAT());
  // });

  // it('Cannot create with an undefined to Time', () => {
  //   var undefinedToTime;

  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '10:00', undefinedToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });

  // it('Cannot create with a null to Time', () => {
  //   var nullToTime = null;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', nullToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME());
  // });

  // it('Cannot create with an  invalid format imput to time', () => {
  //   var anInvalidFormatToTime = 'anInvalidFormatFromTime';

  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', anInvalidFormatToTime, 'Lanus', 1)).toThrowError(Match.INVALID_TIME_FORMAT());
  // });

  // it('Cannot create with an undefined Location', () => {
  //   var undefinedLocation;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', undefinedLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  // });

  // it('Cannot create with a null Location', () => {
  //   var nullLocation = null;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', nullLocation, 1)).toThrowError(Match.INVALID_LOCATION());
  // });

  // it('Cannot create with an undefined Creator', () => {
  //   var undefinedCreator;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', undefinedCreator)).toThrowError(Match.INVALID_CREATOR());
  // });

  // it('Cannot create with a Creator null', () => {
  //   var nullCreator = null;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', nullCreator)).toThrowError(Match.INVALID_CREATOR());
  // });

  // it('Cannot create with an undefined MatchType', () => {
  //   var undefinedMatchType;
  //   expect(() => new Match('Titulo', new Date(2010, 10, 10), '00:00', '01:00', 'Lanus', '1', undefinedMatchType)).toThrowError(Match.INVALID_MATCH_TYPE());
  // });

  // it('Can create a valid Match', () => {
  //   var aTitle = 'Título';
  //   var aDate = new Date(2010, 10, 10);
  //   var aFromTime = '18:00';
  //   var aToTime = '19:00';
  //   var aLocation = 'aLocation';
  //   var aCreator = 1;
  //   var aMatchType = 1;

  //   var match = new Match(aTitle, aDate, aFromTime, aToTime, aLocation, aCreator, aMatchType);

  //   expect(match.title).toEqual(aTitle);
  //   expect(match.date).toEqual(aDate);
  //   expect(match.fromTime).toEqual(aFromTime);
  //   expect(match.toTime).toEqual(aToTime);
  //   expect(match.location).toEqual(aLocation);
  //   expect(match.creator).toEqual(aCreator);
  //   expect(match.matchType).toEqual(aMatchType);
  //   expect(match.comments.length).toEqual(0);
  // });

  // it('Can add a comment', () => {
  //   var match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'aCreator', 1);
  //   match.addComment('owner', 'this is a match comment', new Date());

  //   expect(match.comments.length).toEqual(1);
  // });

  // it('When add a comment must increment id by one', () => {
  //   var match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'aCreator', 1);
  //   match.addComment('owner', 'comment1', new Date());
  //   match.addComment('owner', 'comment2', new Date());

  //   expect(match.comments[0].id).toEqual(1);
  //   expect(match.comments[1].id).toEqual(2);
  // });

  // it('Can update a comment', () => {
  //   var match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'aCreator', 1);
  //   match.addComment('owner', 'comment1', new Date());

  //   var newComment = 'newComment';
  //   match.updateComment(match.comments[0].id, newComment);

  //   expect(match.comments[0].text).toEqual(newComment);
  // });

  // it('Can remove a comment', () => {
  //   var match = new Match('aTitle', new Date(2010, 10, 10), '18:00', '19:00', 'aLocation', 'aCreator', 1);
  //   match.addComment('owner', 'comment1', new Date());
  //   match.addComment('owner', 'comment2', new Date());

  //   match.removeComment(match.comments[0].id);

  //   expect(match.comments.length).toEqual(1);
  //   expect(match.comments[0].id).toEqual(2);
  // });


})