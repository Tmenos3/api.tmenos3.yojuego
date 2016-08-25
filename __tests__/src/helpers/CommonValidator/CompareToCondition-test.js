jest.unmock('../../../../src/helpers/CommonValidator/CompareToCondition');

var CompareToCondition = require('../../../../src/helpers/CommonValidator/CompareToCondition');

describe('CompareToCondition', () => {
  it('Cannot create if compare criteria is undefined', () => {
    var undefinedCompareCriteria;
  
    expect(() => new CompareToCondition('x', undefinedCompareCriteria, 'y', 'error')).toThrowError(CompareToCondition.INVALID_COMPARE_CRITERIA());
  });

  it('Cannot create if compare criteria is null', () => {
    var nullCompareCriteria = null;
  
    expect(() => new CompareToCondition('x', nullCompareCriteria, 'y', 'error')).toThrowError(CompareToCondition.INVALID_COMPARE_CRITERIA());
  });

  it('Cannot create if compare criteria is not in (GR, GRE, LS, LSE, EQ)', () => {
    var invalidCompareCriteria = 'anyValue';
  
    expect(() => new CompareToCondition('x', invalidCompareCriteria, 'y', 'error')).toThrowError(CompareToCondition.INVALID_COMPARE_CRITERIA());
  });

  it('isValid returns false if x is undefined', () => {
    var undefineX;
    var condition = new CompareToCondition(undefineX, 'GR', 'y', 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if x is null', () => {
    var nullX;
    var condition = new CompareToCondition(nullX, 'GR', 'y', 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if y is undefined', () => {
    var undefineY;
    var condition = new CompareToCondition('x', 'GR', undefineY, 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if x is null', () => {
    var nullY;
    var condition = new CompareToCondition('x', 'GR', nullY, 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if x != y with EQ', () => {
    var condition = new CompareToCondition(1, 'EQ', 2, 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if x = y with EQ', () => {
    var condition = new CompareToCondition(1, 'EQ', 1, 'error')
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if x < y with GR', () => {
    var condition = new CompareToCondition(1, 'EQ', 2, 'error')
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if x > y with GR', () => {
    var condition = new CompareToCondition(1, 'EQ', 1, 'error')
  
    expect(condition.isValid()).toBe(true);
  });
});