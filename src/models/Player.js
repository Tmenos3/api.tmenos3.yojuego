let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let ValidMailCondition = require('no-if-validator').ValidMailCondition;

class Player {
    constructor(firstName, lastName, nickName, userid, email, photo, phone) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(firstName).throw(new Error(Player.ERRORS.INVALID_FIRSTNAME)));
        validator.addCondition(new CustomCondition(() => { return firstName !== '' }).throw(new Error(Player.ERRORS.INVALID_FIRSTNAME)));
        validator.addCondition(new NotNullOrUndefinedCondition(lastName).throw(new Error(Player.ERRORS.INVALID_LASTNAME)));
        validator.addCondition(new CustomCondition(() => { return lastName !== '' }).throw(new Error(Player.ERRORS.INVALID_LASTNAME)));
        validator.addCondition(new NotNullOrUndefinedCondition(nickName).throw(new Error(Player.ERRORS.INVALID_NICKNAME)));
        validator.addCondition(new CustomCondition(() => { return nickName !== '' }).throw(new Error(Player.ERRORS.INVALID_NICKNAME)));
        validator.addCondition(new NotNullOrUndefinedCondition(userid).throw(new Error(Player.ERRORS.INVALID_USERID)));
        validator.addCondition(new CustomCondition(() => { return userid !== '' }).throw(new Error(Player.ERRORS.INVALID_USERID)));
        validator.addCondition(new NotNullOrUndefinedCondition(email).throw(new Error(Player.ERRORS.INVALID_EMAIL)));
        validator.addCondition(new CustomCondition(() => { return email !== '' }).throw(new Error(Player.ERRORS.INVALID_EMAIL)));
        validator.addCondition(new ValidMailCondition(email).throw(new Error(Player.ERRORS.INVALID_EMAIL)));

        validator.execute(() => {
            this.firstName = firstName;
            this.lastName = lastName;
            this.nickName = nickName;
            this.userid = userid;
            this.email = email;
            this.photo = photo || null;
            this.phone = phone || null;
            this.auditInfo = null;
        }, (err) => { throw err; });
    }

    setFirstName(newFirstName) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(newFirstName).throw(new Error(Player.ERRORS.INVALID_FIRSTNAME)));
        validator.addCondition(new CustomCondition(() => { return newFirstName !== '' }).throw(new Error(Player.ERRORS.INVALID_FIRSTNAME)));

        validator.execute(() => {
            this.firstName = newFirstName;
        }, (err) => { throw err; });
    }

    setLastName(newLastName) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(newLastName).throw(new Error(Player.ERRORS.INVALID_LASTNAME)));
        validator.addCondition(new CustomCondition(() => { return newLastName !== '' }).throw(new Error(Player.ERRORS.INVALID_LASTNAME)));

        validator.execute(() => {
            this.lastName = newLastName;
        }, (err) => { throw err; });
    }

    setNickName(newNickName) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(newNickName).throw(new Error(Player.ERRORS.INVALID_NICKNAME)));
        validator.addCondition(new CustomCondition(() => { return newNickName !== '' }).throw(new Error(Player.ERRORS.INVALID_NICKNAME)));

        validator.execute(() => {
            this.nickName = newNickName;
        }, (err) => { throw err; });
    }

    setEmail(newEmail) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(newEmail).throw(new Error(Player.ERRORS.INVALID_EMAIL)));
        validator.addCondition(new CustomCondition(() => { return newEmail !== '' }).throw(new Error(Player.ERRORS.INVALID_EMAIL)));
        validator.addCondition(new ValidMailCondition(newEmail).throw(new Error(Player.ERRORS.INVALID_EMAIL)));

        validator.execute(() => {
            this.email = newEmail;
        }, (err) => { throw err; });
    }

    setPhoto(newPhoto) {
        this.photo = newPhoto;
    }

    setPhone(newPhone) {
        this.phone = newPhone;
    }

    static get ERRORS() {
        return {
            INVALID_FIRSTNAME: 'El nombre no puede nulo o indefinido ni vacio.',
            INVALID_LASTNAME: 'El apellido no puede nulo o indefinido ni vacio.',
            INVALID_NICKNAME: 'El nickname no puede nulo o indefinido ni vacio.',
            INVALID_EMAIL: 'El email no puede nulo o indefinido ni vacio y debe tener un formato correcto.',
            INVALID_USERID: 'El userID no puede nulo o indefinido ni vacio.'
        }
    }
}

module.exports = Player;