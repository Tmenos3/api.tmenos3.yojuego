jest.unmock('../../../../src/helpers/CommonValidator/ValidationHelper');

var Condition = require('../../../../src/helpers/CommonValidator/Condition');
var NotNullOrUndefinedCondition = require('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../../../../src/helpers/CommonValidator/CustomCondition');
var ValidationHelper = require('../../../../src/helpers/CommonValidator/ValidationHelper');

describe('ValidationHelper', () => {
  it('Cannot create with a undefined conditions list', () => {
    var undefinedConditionsList;
  
    expect(() => new ValidationHelper(undefinedConditionsList, () => {}, (err) => {})).toThrowError(ValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a null conditions list', () => {
    var nullConditionsList = null;
  
    expect(() => new ValidationHelper(nullConditionsList, () => {}, (err) => {})).toThrowError(ValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a undefined resolve callback', () => {
    var undefinedCallback;
  
    expect(() => new ValidationHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], undefinedCallback, (err) => {})).toThrowError(ValidationHelper.INVALID_RESOLVE_CALLBACK());
  });

  it('Cannot create with a null resolve callback', () => {
    var nullCallback = null;
  
    expect(() => new ValidationHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], nullCallback, (err) => {})).toThrowError(ValidationHelper.INVALID_RESOLVE_CALLBACK());
  });

  it('Cannot create with a undefined reject callback', () => {
    var undefinedReject;
  
    expect(() => new ValidationHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], () => {}, undefinedReject)).toThrowError(ValidationHelper.INVALID_REJECT_CALLBACK());
  });

  it('Cannot create with a null reject callback', () => {
    var nullReject = null;
  
    expect(() => new ValidationHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], () => {}, nullReject)).toThrowError(ValidationHelper.INVALID_REJECT_CALLBACK());
  });

  it('Cannot create with a non-array conditionList', () => {
    var nonArrayConditionList = {};
  
    expect(() => new ValidationHelper(nonArrayConditionList, () => {}, (err) => {})).toThrowError(ValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a array of non Condition conditionList', () => {
    var arrayOfNonConditionList = [{}];
  
    expect(() => new ValidationHelper(arrayOfNonConditionList, () => {}, (err) => {})).toThrowError(ValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Can create with a list of Conditions', () => {
    var listOfConditions = [new NotNullOrUndefinedCondition('parameter', 'error'), new NotNullOrUndefinedCondition('parameter', 'error')];
    var validator = new ValidationHelper(listOfConditions, () => {}, (err) => {});

    expect(validator._conditionList.length).toBe(listOfConditions.length);
  });

  it('Must validate all conditions if all are valid when validator executes', () => {
    var mockedCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    mockedCondition.isValid = jest.fn(() => { return true });

    var listOfConditions = [mockedCondition, mockedCondition];
    var validator = new ValidationHelper(listOfConditions, () => {}, (err) => {});

    validator.execute();

    expect(mockedCondition.isValid.mock.calls.length).toBe(listOfConditions.length);
  });

  it('Must execute reject callback if one condition is not valid', () => {
    var errToBeUsed = 'error';
    var notValidConditionCondition = new NotNullOrUndefinedCondition('aParameter', errToBeUsed);
    notValidConditionCondition.isValid = jest.fn(() => { return false });

    var validConditionCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    validConditionCondition.isValid = jest.fn(() => { return true });

    var reject = jest.fn((err) => {});

    var listOfConditions = [notValidConditionCondition , validConditionCondition];
    var validator = new ValidationHelper(listOfConditions, () => {}, reject);

    validator.execute();

    expect(reject).toBeCalledWith(errToBeUsed);
  });

  it('Must execute resolve callback if all conditions are valid', () => {
    var validConditionCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    validConditionCondition.isValid = jest.fn(() => { return true });

    var resolve = jest.fn(() => {});

    var listOfConditions = [validConditionCondition , validConditionCondition];
    var validator = new ValidationHelper(listOfConditions, resolve, (err) => {});

    validator.execute();

    expect(resolve).toBeCalled();
  });
});