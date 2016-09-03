var InstanceOfCondition = require('../../../../src/helpers/CommonValidator/InstanceOfCondition');

describe('InstanceOfCondition', () => {
  it('Cannot create with an undefined type', () => {
    var undefinedType;
  
    expect(() => new InstanceOfCondition('value', undefinedType, 'err')).toThrowError(InstanceOfCondition.INVALID_TYPE());
  });

  it('Cannot create with an null type', () => {
    var nullType = null;
  
    expect(() => new InstanceOfCondition('value', nullType, 'err')).toThrowError(InstanceOfCondition.INVALID_TYPE());
  });

  it('isValid returns false if value is undefined', () => {
    var undefinedValue;
    var condition = new InstanceOfCondition(undefinedValue, String, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if mail is null', () => {
    var nullValue;
    var condition = new InstanceOfCondition(nullValue, String, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if value is instance of type', () => {
    var value = new String('string');
    var type = String;
    var condition = new InstanceOfCondition(value, type, 'err');
  
    expect(condition.isValid()).toBe(true);
  });

  it('isValid returns false if value is not instance of type', () => {
    var value = 'string';
    var type = InstanceOfCondition;
    var condition = new InstanceOfCondition(value, type, 'err');
  
    expect(condition.isValid()).toBe(false);
  });
});