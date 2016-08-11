export default class Player {
    constructor(username, password, eMail) {
        if (username === null || username === undefined) {
            throw new Error(Player.INVALID_USERNAME());
        }

        if (password === null || password === undefined) {
            throw new Error(Player.INVALID_PASSWORD());
        }

        if (eMail === null || eMail === undefined) {
            throw new Error(Player.INVALID_EAMIL());
        }

        this.validateIfUserNameHasBlankSpaces(username);
        this.validateIfUserNameBeMoreThanFiveCharaters(username);
        this.validateIfPasswordHasBlankSpaces(password);
        this.validateIfPasswordBeMoreThanFiveCharaters(password);
        this.validateIfUserNameAndPasswordAreEqual(username, password);

        this.username = username;
        this.password = password;
        this.eMail = eMail;
    }

    validateIfUserNameHasBlankSpaces(username) {
        if (this.hasBlankSpace(username)) {
            throw new Error(Player.INVALID_USERNAME_HAS_BLANK_SPACE());
        }
    }

    validateIfPasswordHasBlankSpaces(password) {
        if (this.hasBlankSpace(password)) {
            throw new Error(Player.INVALID_PASSWORD_HAS_BLANK_SPACE());
        }
    }

    validateIfUserNameBeMoreThanFiveCharaters(username) {
        if (this.hasMoreThanFiveCharacters(username) == false) {
            throw new Error(Player.INVALID_USERNAME_LENGHT());
        }
    }

    validateIfPasswordBeMoreThanFiveCharaters(password) {
        if (this.hasMoreThanFiveCharacters(password) == false) {
            throw new Error(Player.INVALID_PASSWORD_LENGHT());
        }
    }

    hasBlankSpace(textToValidate) {
        return textToValidate.includes(' ');
    }

    hasMoreThanFiveCharacters(textToValidate) {
        return textToValidate.length > 5;
    }

    validateIfUserNameAndPasswordAreEqual(username, password) {
        if (username === password) {
            throw new Error(USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS());
        }
    }

    equal(otherPlayer) {
        return this.username == otherPlayer.username;
    }

    static INVALID_USERNAME() {
        return 'El nombre de usuario debe tener un valor.';
    }

    static INVALID_PASSWORD() {
        return 'La contraseña debe tener un valor.';
    }

    static INVALID_EAMIL() {
        return 'El email debe tener valor.';
    }

    static INVALID_USERNAME_HAS_BLANK_SPACE() {
        return 'El usuario tiene espacios en blanco.';
    }

    static INVALID_PASSWORD_HAS_BLANK_SPACE() {
        return 'La contraseña tiene espacios en blanco.';
    }

    static INVALID_USERNAME_LENGHT() {
        return 'El nombre de usuario debe contener mas de 5 caracteres.';
    }

    static INVALID_PASSWORD_LENGHT() {
        return 'La contraseña debe contener mas de 5 caracteres.';
    }

    static USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS() {
        return 'El usuario y la contraseña no pueden ser iguales.'
    }
}