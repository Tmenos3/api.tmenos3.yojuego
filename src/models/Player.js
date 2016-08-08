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

        //this.validateIfTheStringHadBlankSpace(username);
        this.validateIfUserNameBeMoreThanFiveCharaters(username);
        this.validateIfUserNameAndPasswordAreEqual(username, password);

        this.username = username;
        this.password = password;
        this.eMail = eMail;
    }

    //validateIfTheStringHadBlankSpace(aaaa) {
    //    for (var index = 0; index < aaaa.length; index++) {
    //        var element = aaaa[index];
    //        if (element == '') {
    //            throw new Error(Player.INVALID_STRING_HAD_BLANK_SPACE());
    //        }
    //    }
    //}

    validateIfUserNameBeMoreThanFiveCharaters(username) {
        if (username.length < 5) {
             throw new Error(INVALID_USERNAME_LENGHT());
        }
    }

    validateIfPasswordBeMoreThanFiveCharaters(password) {
        if (password.length < 5) {
             throw new Error(INVALID_PASSWORD_LENGHT());
        }
    }

    validateIfUserNameAndPasswordAreEqual(username, password){
        if (username === password) {
            throw new Error(USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS());
        }
    }

    equal(otherPlayer) {
        return this.username == otherPlayer.username;
    }

    static INVALID_USERNAME() {
        return "El nombre de usuario debe tener un valor.";
    }

    static INVALID_PASSWORD() {
        return "La contraseña debe tener un valor.";
    }

    static INVALID_EAMIL() {
        return "El email debe tener valor.";
    }

    static INVALID_STRING_HAD_BLANK_SPACE() {
        return "La cadena tiene espacios en blanco.";
    }

    static INVALID_USERNAME_LENGHT() {
        return "El nombre de usuario debe contener mas de 5 caracteres.";
    }

    static INVALID_PASSWORD_LENGHT() {
        return "La contraseña debe contener mas de 5 caracteres.";
    }

    static USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS(){
        return "El usuario y la contraseña no pueden ser iguales."
    }
}