'use strict'

class Field {
    constructor(groundType, roofed, size, value, minToBook) {
        this.groundType = groundType;
        this.roofed = roofed;
        this.size = size;
        this.value = value;
        this.minToBook = minToBook;
    }
}

module.exports = Field;