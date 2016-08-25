jest.unmock('../../../../src/helpers/CommonValidator/GreaterCondition');

var GreaterCondition = require('../../../../src/helpers/CommonValidator/GreaterCondition');

describe('GreaterCondition', () => {
  it('isValid returns false if parameter value is undefined', () => {
    var undefinedValue;
    var condition = new GreaterCondition(undefinedValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value is null', () => {
    var nullValue = null;
    var condition = new GreaterCondition(nullValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is undefined', () => {
    var undefinedCompareTo;
    var condition = new GreaterCondition('value', undefinedCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is null', () => {
    var nullCompareTo = null;
    var condition = new GreaterCondition('value', nullCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value is greater than compareTo', () => {
    var value = 1;
    var compareTo = value - 1;
    var condition = new GreaterCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if value is equal than compareTo', () => {
    var value = 1;
    var compareTo = value;
    var condition = new GreaterCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if value is less than compareTo', () => {
    var value = 2;
    var compareTo = value + 1;
    var condition = new GreaterCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if comparison throws exception', () => {
    var value = 2;
    var compareTo = {};
    var condition = new GreaterCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });
});