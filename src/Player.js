export default class Player {
    constructor(username){
        if (username === null || username === undefined){
            throw new Error(Player.INVALID_USERNAME());
        }

        this.username = username; 
    }

    static INVALID_USERNAME() {
        return "El nombre de usuario debe tener un valor.";
    }
}