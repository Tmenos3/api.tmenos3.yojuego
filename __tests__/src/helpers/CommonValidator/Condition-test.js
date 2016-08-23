jest.unmock('../../../../src/helpers/CommonValidator/Condition');

var Condition = require('../../../../src/helpers/CommonValidator/Condition');

describe('Condition', () => {
  it('Cannot create with an undefined err', () => {
    var undefinedErr;
  
    expect(() => new Condition(undefinedErr)).toThrowError(Condition.INVALID_ERROR());
  });

  it('Cannot create with an null err', () => {
    var nullErr;
  
    expect(() => new Condition(nullErr)).toThrowError(Condition.INVALID_ERROR());
  });

  it('isValid must throw exception', () => {
    var condition = new Condition('error');
  
    expect(() => condition.isValid()).toThrowError(Condition.MUST_BE_OVERRIDED());
  });

  it('getError returns err which it has been created', () => {
    var err = 'error';
    var condition = new Condition(err);
  
    expect(condition.getError()).toBe(err);
  });
});