var ValidMailCondition = require('../../../../src/helpers/CommonValidator/ValidMailCondition');

describe('ValidMailCondition', () => {
  it('isValid returns false if mail is undefined', () => {
    var undefinedMail;
    var condition = new ValidMailCondition(undefinedMail, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if mail is null', () => {
    var nullMail;
    var condition = new ValidMailCondition(nullMail, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns false if mail is not valid', () => {
    var notValidMail = 'invalidMail';
    var condition = new ValidMailCondition(notValidMail, 'err');
  
    expect(condition.isValid()).toBe(false);
  });

  it('isValid returns true if mail is valid', () => {
    var validMail = 'valid@mail.com';
    var condition = new ValidMailCondition(validMail, 'err');
  
    expect(condition.isValid()).toBe(true);
  });
});