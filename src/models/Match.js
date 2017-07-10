let MatchComment = require('./MatchComment');
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let InstanceOfCondition = require('no-if-validator').InstanceOfCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let IsNumberCondition = require('no-if-validator').IsNumberCondition;

class Match {
    constructor(title, date, fromTime, toTime, location, creator, matchType, club, status, auditInfo) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(title).throw(new Error(Match.ERRORS.INVALID_TITLE)));
        validator.addCondition(new NotNullOrUndefinedCondition(date).throw(new Error(Match.ERRORS.INVALID_DATE)));
        validator.addCondition(new NotNullOrUndefinedCondition(fromTime).throw(new Error(Match.ERRORS.INVALID_TIME)));
        validator.addCondition(new CustomCondition(() => {
            let regex = /([01]\d|2[0-3]):([0-5]\d)/;
            return regex.test(fromTime)
        }).throw(new Error(Match.ERRORS.INVALID_TIME_FORMAT)));
        validator.addCondition(new NotNullOrUndefinedCondition(toTime).throw(new Error(Match.ERRORS.INVALID_TIME)));
        validator.addCondition(new CustomCondition(() => {
            let regex = /([01]\d|2[0-3]):([0-5]\d)/;
            return regex.test(toTime)
        }).throw(new Error(Match.ERRORS.INVALID_TIME_FORMAT)));
        validator.addCondition(new NotNullOrUndefinedCondition(location).throw(new Error(Match.ERRORS.INVALID_LOCATION)));
        validator.addCondition(new NotNullOrUndefinedCondition(creator).throw(new Error(Match.ERRORS.INVALID_CREATOR)));
        validator.addCondition(new InstanceOfCondition(date, Date).throw(new Error(Match.ERRORS.INVALID_DATE_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(matchType).throw(new Error(Match.ERRORS.INVALID_MATCH_TYPE)));
        validator.addCondition(new CustomCondition(() => { return Match._isValidType(matchType); }).throw(new Error(Match.ERRORS.INVALID_MATCH_TYPE)));

        validator.execute(() => {
            this.title = title;
            this.date = date;
            this.fromTime = fromTime;
            this.toTime = toTime;
            this.location = location;
            this.creator = creator;
            this.matchType = matchType;
            this.club = club;
            this.status = status || 'PENDING';
            this.auditInfo = auditInfo || null;
            this.confirmedPlayers = [];
            this.pendingPlayers = [];
            this.canceledPlayers = [];
            this.comments = [];
        }, (err) => { throw err; });
    }

    isPending(playerId) {
        return !(!this.pendingPlayers.find(p => { return p === playerId }));
    }

    isConfirmed(playerId) {
        return !(!this.confirmedPlayers.find(p => { return p === playerId }));
    }

    isCancelled(playerId) {
        return !(!this.canceledPlayers.find(p => { return p === playerId }));
    }

    isMember(playerId) {
        return this.creator === playerId ||
            this.isPending(playerId) ||
            this.isConfirmed(playerId) ||
            this.isCancelled(playerId);
    }

    invitePlayer(memberId, playerId) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(memberId).throw(new Error(Match.ERRORS.INVALID_MEMBER)));
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Match.ERRORS.INVALID_PLAYER)));
        validator.addCondition(new CustomCondition(() => { return this.isMember(memberId) }).throw(new Error(Match.ERRORS.ACTION_REQUIRE_MEMBER)));

        validator.execute(() => {
            if (!this.isPending(playerId))
                this.pendingPlayers.push(playerId);
        }, (err) => { throw err; });
    }

    confirmPlayer(playerId) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Match.ERRORS.INVALID_PLAYER)));
        validator.addCondition(new CustomCondition(() => { return this.isPending(playerId) }).throw(new Error(Match.ERRORS.INVALID_PLAYER)));

        validator.execute(() => {
            if (!this.isConfirmed(playerId))
                this.confirmedPlayers.push(playerId);

            if (this.isPending(playerId))
                this._removeInvitedPlayer(playerId)
        }, (err) => { throw err; });
    }

    cancelPlayer(playerId) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Match.ERRORS.INVALID_PLAYER)));
        validator.addCondition(new CustomCondition(() => { return this.isPending(playerId) || this.isConfirmed(playerId) }).throw(new Error(Match.ERRORS.INVALID_PLAYER)));

        validator.execute(() => {
            if (!this.isCancelled(playerId))
                this.canceledPlayers.push(playerId);

            if (this.isPending(playerId))
                this._removeInvitedPlayer(playerId);

            if (this.isConfirmed(playerId))
                this._removeConfirmedPlayer(playerId);
        }, (err) => { throw err; });
    }

    addComment(owner, text, writtenOn) {
        let comment = new MatchComment(this._getNewCommentId(), owner, text, writtenOn);

        let validator = new Validator();
        validator.addCondition(new CustomCondition(() => { return this.isMember(owner) }).throw(new Error(Match.ERRORS.ACTION_REQUIRE_MEMBER)));

        validator.execute(() => {
            this.comments.push(comment);
        }, (err) => { throw err; });

        return comment;
    }

    updateComment(owner, id, newText) {
        let comment = this.comments.find((c) => { return c.id === id });
        if (comment) {
            if (comment.owner !== owner) throw new Error(Match.ERRORS.ACTION_REQUIRE_OWNER);
            comment.text = newText;
        } else
            throw new Error(Match.ERRORS.INVALID_COMMENT);
    }

    removeComment(owner, id) {
        let indexToRemove = this.comments.findIndex((c) => { return c.id === id });

        if (indexToRemove > -1) {
            if (this.comments[indexToRemove].owner !== owner) throw new Error(Match.ERRORS.ACTION_REQUIRE_OWNER);
            this.comments.splice(indexToRemove, 1);
        }
        else
            throw new Error(Match.ERRORS.INVALID_COMMENT);
    }

    cancel() {
        this.status = 'CANCELED';
    }

    _getNewCommentId() {
        let newId = 0

        for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id > newId) {
                newId = this.comments[i].id;
            }
        }

        return newId + 1;
    }

    _existsInPendingPlayers(playerId) {
        for (let i = 0; i < this.pendingPlayers.length; i++) {
            if (this.pendingPlayers[i] == playerId)
                return true
        }
        return false;
    }

    _existsInConfirmedPlayers(playerId) {
        for (let i = 0; i < this.confirmedPlayers.length; i++) {
            if (this.confirmedPlayers[i] == playerId)
                return true
        }
        return false;
    }

    _existsInCanceledPlayers(playerId) {
        let player = this.canceledPlayers.find((p) => { return p === playerId });
        return player !== undefined;
    }

    _removeConfirmedPlayer(playerId) {
        let position = this.confirmedPlayers.indexOf(playerId);
        if (position > -1) {
            this.confirmedPlayers.splice(position, 1);
        }
    }

    _removeInvitedPlayer(playerId) {
        let position = this.pendingPlayers.indexOf(playerId);
        if (position > -1)
            this.pendingPlayers.splice(position, 1);
    }

    static _isValidType(matchType) {
        switch (matchType) {
            case Match.TYPES.FIVE:
            case Match.TYPES.SIX:
            case Match.TYPES.SEVEN:
            case Match.TYPES.EIGHT:
            case Match.TYPES.NINE:
            case Match.TYPES.ELEVEN:
                return true;
            default:
                return false;
        }
    }

    static get ERRORS() {
        return {
            INVALID_DATE: 'La fecha no puede ser null ni undefined.',
            INVALID_TIME: 'La hora no puede ser null ni undefined.',
            INVALID_TIME_FORMAT: 'El formato de la hora debe ser HH:MM.',
            INVALID_LOCATION: 'La ubicacion no puede ser null ni undefined.',
            INVALID_CREATOR: 'El creador no puede ser null ni undefined.',
            INVALID_PLAYER: 'El jugador no puede ser null ni undefined.',
            INVALID_TITLE: 'El titulo no puede ser null ni undefined.',
            INVALID_DATE_TYPE: 'La fecha debe ser del tipo Date.',
            INVALID_MATCH_TYPE: 'El tipo de partido no puede ser nulo o indefinido.',
            ACTION_REQUIRE_MEMBER: 'La accion debe ser realizada por un miembro del match.',
            INVALID_MEMBER: 'El member no puede ser null ni undefined',
            ACTION_REQUIRE_OWNER: 'Solo el owner puede realizar esta accion',
            INVALID_COMMENT: 'El comentario no existe'
        }
    }

    static get TYPES() {
        return {
            FIVE: 5,
            SIX: 6,
            SEVEN: 7,
            EIGHT: 8,
            NINE: 9,
            ELEVEN: 11
        }
    }

    static get STATUS() {
        return {
            PENDING: 'PENDING',
            CANCELLED: 'CANCELLED',
            COMPLETED: 'COMPLETED',
        }
    }
}

module.exports = Match;