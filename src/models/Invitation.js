export default class Invitation {
    constructor(sender){
        if(sender === undefined || sender === null){
            throw new Error(Invitation.INVALID_SENDER());
        }

        this.sender = sender;
    }

    static INVALID_SENDER() {
        return 'El remitente debe contener un valor.';
    }
}