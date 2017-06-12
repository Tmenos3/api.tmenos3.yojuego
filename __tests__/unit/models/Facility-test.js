import Facility from '../../../src/models/club/Facility';

describe('Facilities', () => {
  it('Can create a valid Facilities', () => {
    let aName = 'unNombre';
    let validAvailable = true;

    let aFacility = new Facility(aName, validAvailable);
    expect(aFacility).toBeDefined();
    expect(aFacility.name).toBe(aName);
    expect(aFacility.available).toBe(validAvailable);
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

  it('Cannot create with an undefined available', () => {
    let invalidAvailable;

    expect(() => new Facility('name', invalidAvailable)).toThrowError(Facility.INVALID_AVAILABLE);
  });

  it('Cannot create with null available', () => {
    let invalidAvailable = null;

    expect(() => new Facility('name', invalidAvailable)).toThrowError(Facility.INVALID_AVAILABLE);
  });

  it('Cannot create with invalid available', () => {
    let invalidAvailable = 'asdas';

    expect(() => new Facility('name', invalidAvailable)).toThrowError(Facility.INVALID_AVAILABLE);
  });
})