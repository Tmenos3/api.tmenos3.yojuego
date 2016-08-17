export default class Player {
    constructor(username, password, eMail) {

        this.username = username;
        this.password = password;
        this.eMail = eMail;
    }

    equal(otherPlayer) {
        return this.username == otherPlayer.username;
    }
    
    static USERNAME_AND_PASSWORD_CANNOT_BE_EQUALS() {
        return 'El usuario y la contraseña no pueden ser iguales.'
    }
}