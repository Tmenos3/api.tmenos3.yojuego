import Field from '../../../src/models/club/Field';

describe('Field', () => {
    it('Can create a valid Field', () => {
        // let aName = 'unField';
        // let aDescription = 'unaDescipcion';
        // var buffet = new Buffet();
        // var menLockers = new MenLockers();
        // var womenLockers = new WomenLockers();
        // var grill = new Grill();
        // let facilities = [buffet, menLockers, womenLockers, grill];
        // let aValidAllowOnlineBooking = true;
        // let aValidAllowOnlinePayment = true;
        // let aValidFreeCancellationTime = 3;

        // let aField = new Field(aName, aDescription, facilities, aValidAllowOnlineBooking, aValidAllowOnlinePayment, aValidFreeCancellationTime);
        // expect(aField).toBeDefined();
        // expect(aField.name).toBe(aName);
        // expect(aField.description).toBe(aDescription);
        // expect(aField.facilities).toContain(buffet);
        // expect(aField.facilities).toContain(menLockers);
        // expect(aField.facilities).toContain(womenLockers);
        // expect(aField.facilities).toContain(grill);
        // expect(aField.allowOnlineBooking).toBe(aValidAllowOnlineBooking);
        // expect(aField.allowOnlinePayment).toBe(aValidAllowOnlinePayment);
        // expect(aField.freeCancellationTime).toBe(aValidFreeCancellationTime);
    });

    it('Cannot create with an undefined name', () => {
        let undefinedName;

        expect(() => new Field(undefinedName)).toThrowError(Field.INVALID_NAME);
    });

    it('Cannot create with a null name', () => {
        let nullName = null;

        expect(() => new Field(nullName)).toThrowError(Field.INVALID_NAME);
    });

    it('Cannot create with an invalid name', () => {
        let invalidName = '    ';

        expect(() => new Field(invalidName, 'description')).toThrowError(Field.INVALID_NAME);
    });

    it('Cannot create with an undefined description', () => {
        let undefinedDescription;

        expect(() => new Field('name', undefinedDescription)).toThrowError(Field.INVALID_DESCRIPTION);
    });

    it('Cannot create with an null description', () => {
        let nullDescription = null;

        expect(() => new Field('name', nullDescription)).toThrowError(Field.INVALID_DESCRIPTION);
    });

    it('Cannot create with an invalid description', () => {
        let invalidDescription = '    ';

        expect(() => new Field('name', invalidDescription)).toThrowError(Field.INVALID_DESCRIPTION);
    });

    it('Cannot create with invalid facilities', () => {
        let invalidFacilities = ' ';

        expect(() => new Field('name', 'description', invalidFacilities)).toThrowError(Field.INVALID_FACILITIES);
    });

    it('Cannot create with invalid facilities', () => {
        let invalidFacilities = [new Buffet(), 'nkjbkj', new MenLockers()];

        expect(() => new Field('name', 'description', invalidFacilities)).toThrowError(Field.INVALID_FACILITIES);
    });

    it('Cannot create with undefined allowOnLineBooking', () => {
        let invalidAllowOnLineBooking;

        expect(() => new Field('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Field.INVALID_ALLOW_ONLINE_BOOKING);
    });

    it('Cannot create with null allowOnLineBooking', () => {
        let invalidAllowOnLineBooking = null;

        expect(() => new Field('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Field.INVALID_ALLOW_ONLINE_BOOKING);
    });

    it('Cannot create with invalid allowOnLineBooking', () => {
        let invalidAllowOnLineBooking = 'asdas';

        expect(() => new Field('name', 'description', [], invalidAllowOnLineBooking)).toThrowError(Field.INVALID_ALLOW_ONLINE_BOOKING);
    });

    it('Cannot create with undefined allowOnlinePayment', () => {
        let invalidAllowOnlinePayment;

        expect(() => new Field('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Field.INVALID_ALLOW_ONLINE_PAYMENT);
    });

    it('Cannot create with null allowOnlinePayment', () => {
        let invalidAllowOnlinePayment = null;

        expect(() => new Field('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Field.INVALID_ALLOW_ONLINE_PAYMENT);
    });

    it('Cannot create with invalid allowOnlinePayment', () => {
        let invalidAllowOnlinePayment = 'asdas';

        expect(() => new Field('name', 'description', [], true, invalidAllowOnlinePayment)).toThrowError(Field.INVALID_ALLOW_ONLINE_PAYMENT);
    });

    it('Cannot create with undefined freeCancellationTime', () => {
        let invalidFreeCancellationTime;

        expect(() => new Field('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Field.INVALID_FREE_CANCELLATION_TIME);
    });

    it('Cannot create with null freeCancellationTime', () => {
        let invalidFreeCancellationTime = null;

        expect(() => new Field('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Field.INVALID_FREE_CANCELLATION_TIME);
    });

    it('Cannot create with non numeric freeCancellationTime', () => {
        let invalidFreeCancellationTime = 'asdas';

        expect(() => new Field('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Field.INVALID_FREE_CANCELLATION_TIME);
    });

    it('Cannot create with negative number freeCancellationTime', () => {
        let invalidFreeCancellationTime = -1;

        expect(() => new Field('name', 'description', [], true, true, invalidFreeCancellationTime)).toThrowError(Field.INVALID_FREE_CANCELLATION_TIME);
    });
})