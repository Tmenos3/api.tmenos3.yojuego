import { Facility, Grill } from '../../../src/models/club/Facility';

describe('Facilities', () => {
    it('Can create a valid Facilities', () => {
        let aName = 'unNombre';

        let aFacility = new Facility(aName);
        expect(aFacility).toBeDefined();
        expect(aFacility.name).toBe(aName);
    });

    it('Can create a valid Facilities', () => {
        let aName = 'unNombre';

        let aFacility = new Grill();
        expect(aFacility).toBeDefined();
        expect(aFacility).toBeInstanceOf(Facility);
    });

    it('Cannot create with an undefined name', () => {
        let undefinedName;

        expect(() => new Facility(undefinedName)).toThrowError(Facility.INVALID_NAME);
    });

    it('Cannot create with a null name', () => {
        let nullName = null;

        expect(() => new Facility(nullName)).toThrowError(Facility.INVALID_NAME);
    });

    it('Cannot create with an invalid name', () => {
        let invalidName = '    ';

        expect(() => new Facility(invalidName)).toThrowError(Facility.INVALID_NAME);
    });
})