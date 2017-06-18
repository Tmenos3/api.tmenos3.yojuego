import Club from '../../../src/models/club/Club';
import { Buffet, MenLockers, WomenLockers, Grill } from '../../../src/models/club/Facility';
describe('Club', () => {
  it('Can create a valid Club', () => {
    let aName = 'unClub';
    let aDescription = 'unaDescipcion';
    var buffet = new Buffet();
    var menLockers = new MenLockers();
    var womenLockers = new WomenLockers();
    var grill = new Grill();
    let facilities = [buffet, menLockers, womenLockers, grill];
    let aValidAllowOnlineBooking = true;
    let aValidAllowOnlinePayment = true;
    let aValidFreeCancellationTime = 3;

    let aClub = new Club(aName, aDescription, facilities, aValidAllowOnlineBooking, aValidAllowOnlinePayment, aValidFreeCancellationTime);
    expect(aClub).toBeDefined();
    expect(aClub.name).toBe(aName);
    expect(aClub.description).toBe(aDescription);
    expect(aClub.facilities).toContain(buffet);
    expect(aClub.facilities).toContain(menLockers);
    expect(aClub.facilities).toContain(womenLockers);
    expect(aClub.facilities).toContain(grill);
    expect(aClub.allowOnlineBooking).toBe(aValidAllowOnlineBooking);
    expect(aClub.allowOnlinePayment).toBe(aValidAllowOnlinePayment);
    expect(aClub.freeCancellationTime).toBe(aValidFreeCancellationTime);
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
    let invalidFacilities = [new Buffet(), 'nkjbkj', new MenLockers()];

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

  it('Cannot create with undefined freeCancellationTime', () => {
    let invalidFreeCancellationTime;

    expect(() => new Club('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Club.INVALID_FREE_CANCELLATION_TIME);
  });

  it('Cannot create with null freeCancellationTime', () => {
    let invalidFreeCancellationTime = null;

    expect(() => new Club('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Club.INVALID_FREE_CANCELLATION_TIME);
  });

  it('Cannot create with non numeric freeCancellationTime', () => {
    let invalidFreeCancellationTime = 'asdas';

    expect(() => new Club('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Club.INVALID_FREE_CANCELLATION_TIME);
  });

  it('Cannot create with negative number freeCancellationTime', () => {
    let invalidFreeCancellationTime = -1;

    expect(() => new Club('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Club.INVALID_FREE_CANCELLATION_TIME);
  });
})