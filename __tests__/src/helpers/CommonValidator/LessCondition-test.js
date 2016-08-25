jest.unmock('../../../../src/helpers/CommonValidator/LessCondition');

var LessCondition = require('../../../../src/helpers/CommonValidator/LessCondition');

describe('LessCondition', () => {
  it('isValid returns false if parameter value is undefined', () => {
    var undefinedValue;
    var condition = new LessCondition(undefinedValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value is null', () => {
    var nullValue = null;
    var condition = new LessCondition(nullValue, 'compareTo', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is undefined', () => {
    var undefinedCompareTo;
    var condition = new LessCondition('value', undefinedCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter compareTo is null', () => {
    var nullCompareTo = null;
    var condition = new LessCondition('value', nullCompareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value is less than compareTo', () => {
    var value = 1;
    var compareTo = value + 1;
    var condition = new LessCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if value is equal than compareTo', () => {
    var value = 1;
    var compareTo = value;
    var condition = new LessCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if value is greater than compareTo', () => {
    var value = 2;
    var compareTo = value - 1;
    var condition = new LessCondition(value, compareTo, 'error');
  
    expect(condition.isValid()).toBe(false);
  });
});