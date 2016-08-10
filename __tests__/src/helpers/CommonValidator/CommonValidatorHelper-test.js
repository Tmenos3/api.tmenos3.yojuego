jest.unmock('../../../../src/helpers/CommonValidator/CommonValidatorHelper');

var Condition = require('../../../../src/helpers/CommonValidator/Condition');
var NotNullOrUndefinedCondition = require('../../../../src/helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../../../../src/helpers/CommonValidator/CustomCondition');
var CommonValidatorHelper = require('../../../../src/helpers/CommonValidator/CommonValidatorHelper');

describe('CommonValidatorHelper', () => {
  it('Cannot create with a undefined conditions list', () => {
    var undefinedConditionsList;
  
    expect(() => new CommonValidatorHelper(undefinedConditionsList, () => {}, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a null conditions list', () => {
    var nullConditionsList = null;
  
    expect(() => new CommonValidatorHelper(nullConditionsList, () => {}, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a undefined resolve callback', () => {
    var undefinedCallback;
  
    expect(() => new CommonValidatorHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], undefinedCallback, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_RESOLVE_CALLBACK());
  });

  it('Cannot create with a null resolve callback', () => {
    var nullCallback = null;
  
    expect(() => new CommonValidatorHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], nullCallback, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_RESOLVE_CALLBACK());
  });

  it('Cannot create with a undefined reject callback', () => {
    var undefinedReject;
  
    expect(() => new CommonValidatorHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], () => {}, undefinedReject)).toThrowError(CommonValidatorHelper.INVALID_REJECT_CALLBACK());
  });

  it('Cannot create with a null reject callback', () => {
    var nullReject = null;
  
    expect(() => new CommonValidatorHelper([new NotNullOrUndefinedCondition('aParameter', 'error')], () => {}, nullReject)).toThrowError(CommonValidatorHelper.INVALID_REJECT_CALLBACK());
  });

  it('Cannot create with a non-array conditionList', () => {
    var nonArrayConditionList = {};
  
    expect(() => new CommonValidatorHelper(nonArrayConditionList, () => {}, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_CONDITION_LIST());
  });

  it('Cannot create with a array of non Condition conditionList', () => {
    var arrayOfNonConditionList = [{}];
  
    expect(() => new CommonValidatorHelper(arrayOfNonConditionList, () => {}, (err) => {})).toThrowError(CommonValidatorHelper.INVALID_CONDITION_LIST());
  });

  it('Can create with a list of Conditions', () => {
    var listOfConditions = [new NotNullOrUndefinedCondition('parameter', 'error'), new NotNullOrUndefinedCondition('parameter', 'error')];
    var validator = new CommonValidatorHelper(listOfConditions, () => {}, (err) => {});

    expect(validator._conditionList.length).toBe(listOfConditions.length);
  });

  it('Must validate all conditions if all are valid when validator executes', () => {
    var mockedCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    mockedCondition.isValid = jest.fn(() => { return true });

    var listOfConditions = [mockedCondition, mockedCondition];
    var validator = new CommonValidatorHelper(listOfConditions, () => {}, (err) => {});

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
    var validator = new CommonValidatorHelper(listOfConditions, () => {}, reject);

    validator.execute();

    expect(reject).toBeCalledWith(errToBeUsed);
  });

  it('Must execute resolve callback if all conditions are valid', () => {
    var validConditionCondition = new NotNullOrUndefinedCondition('aParameter', 'error');
    validConditionCondition.isValid = jest.fn(() => { return true });

    var resolve = jest.fn(() => {});

    var listOfConditions = [validConditionCondition , validConditionCondition];
    var validator = new CommonValidatorHelper(listOfConditions, resolve, (err) => {});

    validator.execute();

    expect(resolve).toBeCalled();
  });
});