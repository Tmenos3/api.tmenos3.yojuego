let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class ESRepository {
    constructor(client) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(client).throw(new Error(ESRepository.ERRORS.INVALID_CLIENT)));

        validator.execute(() => {
            this.esclient = client;
        }, (err) => { throw err; });
    }

    getAll(index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.search({
                    "index": index,
                    "type": type,
                    "body": {
                        "query": {
                            "match_all": {}
                        }
                    }
                }, (error, response, status) => {
                    if (error) {
                        if (error.status == 404) {
                            resolve({ code: 200, message: null, resp: [] });
                        } else {
                            reject({ code: error.status, message: error.message, resp: error });
                        }
                    }
                    else {
                        resolve({ code: 200, message: null, resp: response });
                    }
                });
            }, (err) => { throw err; });
        });
    }

    get(id, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(ESRepository.ERRORS.INVALID_ID)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.get({
                    index: index,
                    type: type,
                    id: id
                }, (error, response, status) => {
                    if (error) {
                        if (error.status == 404) {
                            resolve({ code: 200, message: null, resp: null });
                        } else {
                            reject({ code: error.status, message: error.message, resp: error });
                        }
                    }
                    else {
                        resolve({ code: 200, message: null, resp: response });
                    }
                });
            }, (err) => { throw err; });
        });
    }

    add(document, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(document).throw(new Error(ESRepository.ERRORS.INVALID_DOCUMENT)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.index({
                    index: index,
                    type: type,
                    body: document
                }, (error, resp) => {
                    if (error) {
                        reject({ code: error.statusCode, message: error.message, resp: error });
                    } else {
                        resolve({ code: 200, message: ESRepository.MESSAGES.DOCUMENT_INSERTED, resp: resp });
                    }
                });
            }, (err) => { throw err; });
        });
    }

    delete(id, index, type) {
        //TEST: not null, not undefined
        //warning: revisar sintaxis.
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(ESRepository.ERRORS.INVALID_ID)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            this.esclient.delete({
                index: index,
                type: type,
                id: id
            }, (error, resp) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                } else {
                    resolve({ code: 200, message: ESRepository.MESSAGES.DOCUMENT_DELETED, resp: resp });
                }
            });
        }, (err) => { throw err; });
    }

    update(id, document, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(ESRepository.ERRORS.INVALID_ID)));
            validator.addCondition(new NotNullOrUndefinedCondition(document).throw(new Error(ESRepository.ERRORS.INVALID_DOCUMENT)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.update({
                    index: index,
                    type: type,
                    id: id,
                    body: {
                        doc: document
                    }
                }, (error, resp) => {
                    if (error) {
                        reject({ code: error.statusCode, message: error.message, resp: error });
                    } else {
                        resolve({ code: 200, message: ESRepository.MESSAGES.DOCUMENT_UPDATED, resp: resp });
                    }
                });
            }, (err) => { throw err; });
        });
    }

    getBy(query, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(query).throw(new Error(ESRepository.ERRORS.INVALID_QUERY)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.ERRORS.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.ERRORS.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.search({
                    "index": index,
                    "type": type,
                    "body": {
                        "query": query
                    }
                }, (error, response) => {
                    if (error) {
                        reject({ code: error.statusCode, message: error.message, resp: error });
                    }
                    else {
                        if (response.hits.hits.length < 1)
                            resolve({ code: 200, message: null, resp: [] });
                        else
                            resolve({ code: 200, message: null, resp: response.hits.hits });
                    }
                });
            }, (err) => reject({ code: 400, message: err.message, resp: err }));
        });
    }

    static get ERRORS() {
        return {
            INVALID_CLIENT: 'Invalid ES Client.',
            INVALID_ID: 'Invalid ID.',
            INVALID_QUERY: 'Invalid query.',
            INVALID_DOCUMENT: 'Invalid document.',
            INVALID_INDEX: 'Invalid index.',
            INVALID_TYPE: 'Invalid type.',
            UNEXPECTED_ERROR: 'Unexpected error.'
        }
    }

    static get MESSAGES() {
        return {
            DOCUMENT_INSERTED: 'Document inserted.',
            DOCUMENT_UPDATED: 'Document updated.',
            DOCUMENT_DELETED: 'Document deleted.',
        }
    }
}

module.exports = ESRepository;