jest.unmock('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');

var NotNullOrUndefinedCondition = require('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');

describe('NotNullOrUndefinedCondition', () => {
  it('Cannot create with an undefined err', () => {
    var undefinedErr;
  
    expect(() => new NotNullOrUndefinedCondition('aParameter', undefinedErr)).toThrowError(NotNullOrUndefinedCondition.INVALID_ERROR());
  });

  it('Cannot create with an null err', () => {
    var nullErr;
  
    expect(() => new NotNullOrUndefinedCondition('aParameter', nullErr)).toThrowError(NotNullOrUndefinedCondition.INVALID_ERROR());
  });

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

  it('getError returns the error wich Condition was created', () => {
    var error = 'error';
    var condition = new NotNullOrUndefinedCondition('parameter', error);
  
    expect(condition.getError()).toBe(error);
  });
});