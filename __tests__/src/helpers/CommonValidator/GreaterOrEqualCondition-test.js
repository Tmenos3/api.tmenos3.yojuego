jest.unmock('../../../../src/helpers/CommonValidator/GreaterOrEqualCondition');

var GreaterOrEqualCondition = require('../../../../src/helpers/CommonValidator/GreaterOrEqualCondition');

describe('GreaterOrEqualCondition', () => {
  it('isValid returns false if parameter value is undefined', () => {
    var undefinedValue;
    var condition = new GreaterOrEqualCondition(undefinedValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value is null', () => {
    var nullValue = null;
    var condition = new GreaterOrEqualCondition(nullValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is undefined', () => {
    var undefinedCompareTo;
    var condition = new GreaterOrEqualCondition('value', undefinedCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is null', () => {
    var nullCompareTo = null;
    var condition = new GreaterOrEqualCondition('value', nullCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value is greater than compareTo', () => {
    var value = 1;
    var compareTo = value - 1;
    var condition = new GreaterOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns true if value is equal than compareTo', () => {
    var value = 1;
    var compareTo = value;
    var condition = new GreaterOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if value is less than compareTo', () => {
    var value = 2;
    var compareTo = value + 1;
    var condition = new GreaterOrEqualCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });
});