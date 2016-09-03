var Condition = require('../../../../src/helpers/CommonValidator/Condition');
var NotNullOrUndefinedCondition = require('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../../../../src/helpers/CommonValidator/CustomCondition');
var PromiseValidationHelper = require('../../../../src/helpers/CommonValidator/PromiseValidationHelper');

describe('PromiseValidationHelper', () => {
  it('Cannot create with a undefined conditions list', () => {
    var undefinedConditionsList;

    expect(() => new PromiseValidationHelper(undefinedConditionsList).toThrowError(PromiseValidationHelper.INVALID_CONDITION_LIST()));
  });

  it('Cannot create with a null conditions list', () => {
    var nullConditionsList = null;

    expect(() => new PromiseValidationHelper(nullConditionsList).toThrowError(PromiseValidationHelper.INVALID_CONDITION_LIST()));
  });

  it('Cannot create with a non-array conditionList', () => {
    var nonArrayConditionList = {};

    expect(() => new PromiseValidationHelper(nonArrayConditionList)).toThrowError(PromiseValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a array of non Condition conditionList', () => {
    var arrayOfNonConditionList = [{}];

    expect(() => new PromiseValidationHelper(arrayOfNonConditionList)).toThrowError(PromiseValidationHelper.INVALID_CONDITION_LIST());
  });

  it('Can create with a list of Conditions', () => {
    var listOfConditions = [new NotNullOrUndefinedCondition('parameter', 'error'), new NotNullOrUndefinedCondition('parameter', 'error')];
    var validator = new PromiseValidationHelper(listOfConditions);

    expect(validator._conditionList.length).toBe(listOfConditions.length);
  });

  pit('Must validate all conditions if all are valid when validator executes', () => {
    var mockedCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    mockedCondition.isValid = jest.fn(() => { return true });

    var listOfConditions = [mockedCondition, mockedCondition];
    var validator = new PromiseValidationHelper(listOfConditions);

    return validator.execute()
      .then(() => expect(mockedCondition.isValid.mock.calls.length).toBe(listOfConditions.length),
      (err) => expect(true).toBe(false));
  });

  pit('Must execute reject if one condition is not valid', () => {
    var errToBeUsed = 'error';
    var notValidConditionCondition = new NotNullOrUndefinedCondition('aParameter', errToBeUsed);
    notValidConditionCondition.isValid = jest.fn(() => { return false });

    var validConditionCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    validConditionCondition.isValid = jest.fn(() => { return true });

    var reject = jest.fn((err) => { });

    var listOfConditions = [notValidConditionCondition, validConditionCondition];
    var validator = new PromiseValidationHelper(listOfConditions);

    return validator.execute()
      .then(() => expect(false).toBe(true), (err) => expect(err).toEqual(notValidConditionCondition.getError()));
  });

  pit('Must execute resolve if all conditions are valid', () => {
    var validConditionCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    validConditionCondition.isValid = jest.fn(() => { return true });

    var resolve = jest.fn(() => { });

    var listOfConditions = [validConditionCondition, validConditionCondition];
    var validator = new PromiseValidationHelper(listOfConditions);

    return validator.execute()
      .then(() => expect(true).toBe(true), (err) => expect(true).toBe(false));
  });
});