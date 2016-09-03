var NotNullOrUndefinedCondition = require('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');

describe('NotNullOrUndefinedCondition', () => {
  it('isValid returns false if parameter is undefined', () => {
    var undefinedParameter;
    var condition = new NotNullOrUndefinedCondition(undefinedParameter, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if parameter is null', () => {
    var nullParameter = null;
    var condition = new NotNullOrUndefinedCondition(nullParameter, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if parameter is not null and is not undefined', () => {
    var notNullAndNotUndefinedParameter = {};
    var condition = new NotNullOrUndefinedCondition(notNullAndNotUndefinedParameter, 'error');
  
    expect(condition.isValid()).toBe(true);
  });
});