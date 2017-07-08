let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let EqualCondition = require('no-if-validator').EqualCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let Message = require('./Message');

class Group {
    constructor(players, admins, description, photo, messages) {
        this.addPlayer = this.addPlayer.bind(this);
        this.makeAdmin = this.makeAdmin.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.removeMessage = this.removeMessage.bind(this);
        this._removePlayer = this._removePlayer.bind(this);
        this._removeAdmin = this._removeAdmin.bind(this);
        this._existsInPlayers = this._existsInPlayers.bind(this);
        this._existsInAdmins = this._existsInAdmins.bind(this);
        this._getNewMessageId = this._getNewMessageId.bind(this);
        this._addAdminIfThereAreNoAdmins = this._addAdminIfThereAreNoAdmins.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(players).throw(new Error(Group.ERRORS.INVALID_PLAYER_LIST)));
        validator.addCondition(new CustomCondition(() => { return players instanceof Array }).throw(new Error(Group.ERRORS.INVALID_PLAYER_LIST)));
        validator.addCondition(new CustomCondition(() => { return players.length > 0 }).throw(new Error(Group.ERRORS.PLAYER_LIST_MUST_CONTAIN_PLAYERS)));
        validator.addCondition(new NotNullOrUndefinedCondition(admins).throw(new Error(Group.ERRORS.INVALID_ADMIN_LIST)));
        validator.addCondition(new CustomCondition(() => { return admins instanceof Array }).throw(new Error(Group.ERRORS.INVALID_ADMIN_LIST)));
        validator.addCondition(new CustomCondition(() => { return admins.length > 0 }).throw(new Error(Group.ERRORS.ADMIN_LIST_MUST_CONTAIN_PLAYERS)));
        validator.addCondition(new CustomCondition(() => { return Group._areAllPlayers(players, admins); }).throw(new Error(Group.ERRORS.ADMINS_MUST_BE_PLAYERS)));
        validator.addCondition(new NotNullOrUndefinedCondition(description).throw(new Error(Group.ERRORS.INVALID_DESCRIPTION)));

        validator.execute(() => {
            this.players = [...new Set(players)];
            this.admins = [...new Set(admins)];
            this.description = description;
            this.photo = photo || null;
            this.messages = messages || [];
        }, (err) => { throw err; });
    }

    addPlayer(adminId, playerId) {
        let validator = new Validator();
        validator.addCondition(new CustomCondition(() => { return this.isAdmin(adminId) }).throw(new Error(Group.ERRORS.ACTION_REQUIRE_ADMIN)));

        validator.execute(() => {
            if (!this.isMember(playerId))
                this.players.push(playerId);
        }, (err) => { throw err; });
    }

    makeAdmin(adminId, playerId) {
        let validator = new Validator();
        validator.addCondition(new CustomCondition(() => { return this.isAdmin(adminId) }).throw(new Error(Group.ERRORS.ACTION_REQUIRE_ADMIN)));
        validator.addCondition(new CustomCondition(() => { return this.isMember(playerId) }).throw(new Error(Group.ERRORS.PLAYER_IS_NOT_MEMBER)));

        validator.execute(() => {
            if (!this.isAdmin(playerId))
                this.admins.push(playerId);
        }, (err) => { throw err; });
    }

    removePlayer(adminId, playerId) {
        let validator = new Validator();
        validator.addCondition(new CustomCondition(() => { return this.isAdmin(adminId) || (adminId === playerId) }).throw(new Error(Group.ERRORS.ACTION_REQUIRE_ADMIN)));

        validator.execute(() => {
            this._removePlayer(playerId);
            this._removeAdmin(playerId);
            this._addAdminIfThereAreNoAdmins();
        }, (err) => { throw err; });
    }

    isAdmin(playerId) {
        return this._existsInAdmins(playerId);
    }

    isMember(playerId) {
        return this._existsInAdmins(playerId) || this._existsInPlayers(playerId);
    }

    addMessage(owner, text, writtenOn) {
        let validator = new Validator();
        validator.addCondition(new CustomCondition(() => { return this.isMember(owner) }).throw(new Error(Group.ERRORS.PLAYER_IS_NOT_MEMBER)));

        let msg = null;
        validator.execute(() => {
            msg = new Message(this._getNewMessageId(), owner, text, writtenOn);
            this.messages.push(msg);
        }, (err) => { throw err; });

        return msg;
    }

    updateMessage(owner, id, newText, updatedOn) {
        let messageToUpdate = this.messages.find((c) => { return c.id === id });
        if (!messageToUpdate) throw new Error(Group.ERRORS.INVALID_GROUP_MESSAGE);
        if (messageToUpdate.owner !== owner) throw new Error(Group.ERRORS.PLAYER_IS_NOT_OWNER);

        messageToUpdate.update(newText, updatedOn);
    }

    removeMessage(owner, id) {
        let messageToRemove = this.messages.find((c) => { return c.id === id });
        if (!messageToRemove) throw new Error(Group.ERRORS.INVALID_GROUP_MESSAGE);
        if (messageToRemove.owner !== owner) throw new Error(Group.ERRORS.PLAYER_IS_NOT_OWNER);

        let i = this.messages.findIndex((c) => { return c.id === id });
        this.messages.splice(i, 1);
    }

    _getNewMessageId() {
        let newId = 0;

        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].id > newId) {
                newId = this.messages[i].id;
            }
        }

        return newId + 1;
    }

    _removePlayer(playerId) {
        var position = this.players.indexOf(playerId);
        if (position > -1)
            this.players.splice(position, 1);
    }

    _removeAdmin(adminId) {
        var position = this.admins.indexOf(adminId);
        if (position > -1)
            this.admins.splice(position, 1);
    }

    _existsInPlayers(playerId) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] == playerId)
                return true
        }
        return false;
    }

    _existsInAdmins(playerId) {
        for (var i = 0; i < this.admins.length; i++) {
            if (this.admins[i] == playerId)
                return true
        }
        return false;
    }

    _addAdminIfThereAreNoAdmins() {
        if (this.admins.length === 0 && this.players.length > 0)
            this.admins.push(this.players[0]);
    }

    static _areAllPlayers(players, admins) {
        for (let i = 0; i < admins.length; i++) {
            if (!players.find(p => { return p === admins[i]; }))
                return false;
        }
        return true;
    }

    static get ERRORS() {
        return {
            INVALID_PLAYER_LIST: 'La lista de players no puede ser null ni undefined, y debe ser un array.',
            ACTION_REQUIRE_ADMIN: 'La accion require ser ejecutada por un administrador del grupo.',
            PLAYER_LIST_MUST_CONTAIN_PLAYERS: 'La lista de players debe contener al menos un player.',
            INVALID_ADMIN_LIST: 'La lista de admins no puede ser null ni undefined, y debe ser un array.',
            ADMIN_LIST_MUST_CONTAIN_PLAYERS: 'La lista de admins debe contener al menos un admin.',
            ADMINS_MUST_BE_PLAYERS: 'Los admins deben ser players',
            INVALID_DESCRIPTION: 'La descripcion no puede ser null ni undefined ni vacio.',
            PLAYER_IS_NOT_MEMBER: 'EL player no pertenece al grupo',
            INVALID_GROUP_MESSAGE: 'EL mensaje es invalido.',
            PLAYER_IS_NOT_OWNER: 'El player no el owner del mensaje.'
        }
    }
}

module.exports = Group;