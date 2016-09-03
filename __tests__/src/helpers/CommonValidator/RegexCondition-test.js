var RegexCondition = require('../../../../src/helpers/CommonValidator/RegexCondition');

describe('RegexCondition', () => {
  it('Cannot create with an undefined regex', () => {
    var undefinedRegex;
  
    expect(() => new RegexCondition('any value', undefinedRegex, 'err')).toThrowError(RegexCondition.INVALID_REGEX());
  });

  it('Cannot create with an null regex', () => {
    var nullRegex = null;
  
    expect(() => new RegexCondition('any value', nullRegex, 'err')).toThrowError(RegexCondition.INVALID_REGEX());
  });

  it('Cannot create with an non-string regex', () => {
    var nonStringRegex = {};
  
    expect(() => new RegexCondition('any value', nonStringRegex, 'err')).toThrowError(RegexCondition.INVALID_REGEX());
  });

  it('isValid returns false if value is undefined', () => {
    var undefinedValue;
    var condition = new RegexCondition(undefinedValue, 'regularExpresion', 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if value is null', () => {
    var nullValue = null;
    var condition = new RegexCondition(nullValue, 'regularExpresion', 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if value not match with regex', () => {
    var regex = '[A-Z]';
    var notMatchingValue = '123';
    var condition = new RegexCondition(notMatchingValue, regex, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value match with regex', () => {
    var regex = '[A-Z]';
    var matchingValue = 'ABC';
    var condition = new RegexCondition(matchingValue, regex, 'err');
  
    expect(condition.isValid()).toBe(true);
  });
});