'use strict'

class Facilities {
    constructor(buffet, parking, wifi, dressingRoom) {
        this.buffet = buffet;
        this.parking = parking;
        this.wifi = wifi;
        this.dressingRoom = dressingRoom;
    }

    hasBuffet(){
        return this.buffet;
    }

    hasWifi(){
        return this.wifi;
    }

    hasParking(){
        return this.parking;
    }

    hasDressingRoom(){
        return this.dressingRoom;
    }
}

module.exports = Player;