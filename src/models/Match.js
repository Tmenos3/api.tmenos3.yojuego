export default class Match {
        constructor(date, time, location){
        if (date === null || date === undefined){
            throw new Error(Match.INVALID_DATE());
        }
        if (time === null || time === undefined){
             throw new Error(Match.INVALID_TIME());
        }
        if (location === null || location === undefined){
             throw new Error(Match.INVALID_LOCATION());
        }
        this.date = date; 
        this.time = time;
        this.location = location;
    }

    static INVALID_DATE() {
        return "La fecha no debe ser invalida.";
    }
    static INVALID_TIME() {
        return "La hora no debe ser invalida.";
    }
     static INVALID_LOCATION() {
        return "La ubicación no debe ser invalida.";
    }
}