var CustomCondition = require('../../../../src/helpers/CommonValidator/CustomCondition');

describe('CustomCondition', () => {
  it('Cannot create with an undefined customAction', () => {
    var undefinedCustomAction;
  
    expect(() => new CustomCondition(undefinedCustomAction, 'err')).toThrowError(CustomCondition.INVALID_CUSTOM_ACTION());
  });

  it('Cannot create with an null customAction', () => {
    var nullCustomAction = null;
  
    expect(() => new CustomCondition(nullCustomAction, 'err')).toThrowError(CustomCondition.INVALID_CUSTOM_ACTION());
  });

  it('Cannot create with an non-function customAction', () => {
    var nonFunctionCustomAction = {};
  
    expect(() => new CustomCondition(nonFunctionCustomAction, 'err')).toThrowError(CustomCondition.INVALID_CUSTOM_ACTION());
  });

  it('If customAction throw an error isValid returns false', () => {
    var customActionThrowError = () => { throw new Error(); };
    var condition = new CustomCondition(customActionThrowError, 'err');

    expect(condition.isValid()).toBe(false);
  });

  it('If customAction throw an error getError must returns customAction error', () => {
    var customActionError = 'exception error'
    var customActionThrowError = () => { throw new Error(customActionError); };
    var condition = new CustomCondition(customActionThrowError, 'err');
    condition.isValid();

    expect(condition.getError()).toBe(customActionError);
  });

  it('isValid returns false if customAction returns false', () => {
    var falseCustomAction = () => { return false; };
    var condition = new CustomCondition(falseCustomAction, 'error');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if customAction returns true', () => {
    var trueCustomAction = () => { return true; };
    var condition = new CustomCondition(trueCustomAction, 'error');
  
    expect(condition.isValid()).toBe(true);
  });
});