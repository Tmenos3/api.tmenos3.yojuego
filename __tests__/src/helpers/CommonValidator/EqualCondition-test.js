var EqualCondition = require('../../../../src/helpers/CommonValidator/EqualCondition');

describe('EqualCondition', () => {
  it('isValid returns false if parameter value1 is undefined and value2 is not undefined', () => {
    var undefinedValue;
    var condition = new EqualCondition(undefinedValue, 'notUndefinedValue', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value1 is not undefined and value2 is undefined', () => {
    var undefinedValue;
    var condition = new EqualCondition('notUndefinedValue', undefinedValue, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value1 is null and value2 is not null', () => {
    var nullValue;
    var condition = new EqualCondition(nullValue, 'notNullValue', 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value1 is not null and value2 is null', () => {
    var nullValue;
    var condition = new EqualCondition('notNullValue', nullValue, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter value1 is not equal to value2', () => {
    var condition = new EqualCondition('anyValue', 5, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if parameter value1 is equal to value2', () => {
    var value = 'value';
    var condition = new EqualCondition(value, value, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns true if parameter value1 and value2 are null', () => {
    var nullValue = null;
    var condition = new EqualCondition(nullValue, nullValue, 'error');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns true if parameter value1 and value2 are undefined', () => {
    var undefinedValue = null;
    var condition = new EqualCondition(undefinedValue, undefinedValue, 'error');

    expect(condition.isValid()).toBe(true);
  });
});