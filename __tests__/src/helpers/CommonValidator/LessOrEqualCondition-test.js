var LessOrEqualCondition = require('../../../../src/helpers/CommonValidator/LessOrEqualCondition');

describe('LessOrEqualCondition', () => {
  it('isValid returns false if parameter value is undefined', () => {
    var undefinedValue;
    var condition = new LessOrEqualCondition(undefinedValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value is null', () => {
    var nullValue = null;
    var condition = new LessOrEqualCondition(nullValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is undefined', () => {
    var undefinedCompareTo;
    var condition = new LessOrEqualCondition('value', undefinedCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is null', () => {
    var nullCompareTo = null;
    var condition = new LessOrEqualCondition('value', nullCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value is less than compareTo', () => {
    var value = 1;
    var compareTo = value + 1;
    var condition = new LessOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns true if value is equal than compareTo', () => {
    var value = 1;
    var compareTo = value;
    var condition = new LessOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if value is greater than compareTo', () => {
    var value = 2;
    var compareTo = value - 1;
    var condition = new LessOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });
});