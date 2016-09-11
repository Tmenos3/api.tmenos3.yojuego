var ElasticSearch = require('elasticsearch');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class ESRepository {
    constructor(client) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(client).throw(new Error(ESRepository.INVALID_CLIENT)));

        validator.execute(() => {
            this.esclient = client;
        }, (err) => { throw err; });
    }

    getById(id, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(ESRepository.INVALID_ID)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.get(this._getQueryForGetById(id, index, type), (error, response, status) => {
                    if (error) {
                        if (error.status == 404) {
                            resolve(null);
                        } else {
                            reject(ESRepository.UNEXPECTED_ERROR);
                        }
                    }
                    else {
                        resolve(response);
                    }
                });
            }, (err) => { throw err; });
        });
    }

    getBy(criteria, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(criteria).throw(new Error(ESRepository.INVALID_CRITERIA)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.search(this._getQueryForSearchBy(criteria, index, type), (error, response, status) => {
                    if (error) {
                        reject(ESRepository.UNEXPECTED_ERROR);
                    }
                    else {
                        resolve(response.hits.hits);
                    }
                });
            }, (err) => { throw err; });
        });
    }

    add(document, index, type) {
        return new Promise((resolve, reject) => {
            let validator = new Validator();
            validator.addCondition(new NotNullOrUndefinedCondition(document).throw(new Error(ESRepository.INVALID_DOCUMENT)));
            validator.addCondition(new NotNullOrUndefinedCondition(index).throw(new Error(ESRepository.INVALID_INDEX)));
            validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(ESRepository.INVALID_TYPE)));

            validator.execute(() => {
                this.esclient.index(this._getQueryForAdd(document, index, type), (error, resp) => {
                    if (error) {
                        reject(ESRepository.UNEXPECTED_ERROR);
                    }
                    else {
                        resolve({ message: ESRepository.DOCUMENT_INSERTED, resp: resp });
                    }
                });
            }, (err) => { throw err; });
        });
    }

    delete(id, index, type) {
        throw new Error('must be implemented');
    }

    update(id, index, type) {
        throw new Error('must be implemented');
    }

    _getQueryForGetById(id, index, type) {
        return {
            index: index,
            type: type,
            id: id
        }
    }

    _getQueryForSearchBy(criteria, index, type) {
        return {
            index: index,
            type: type,
            query: criteria
        }
    }

    _getQueryForAdd(document, index, type) {
        return {
            index: index,
            type: type,
            body: document
        }
    }

    static get INVALID_CLIENT() {
        return "Invalid Client";
    }

    static get INVALID_ID() {
        return "Invalid id";
    }

    static get INVALID_CRITERIA() {
        return "Invalid criteria";
    }

    static get INVALID_DOCUMENT() {
        return "Invalid document";
    }

    static get INVALID_INDEX() {
        return "Invalid index";
    }

    static get INVALID_TYPE() {
        return "Invalid type";
    }

    static get DOCUMENT_INSERTED() {
        return "Document inserted.";
    }

    static get UNEXPECTED_ERROR() {
        return "Unexpected error.";
    }
}

module.exports = ESRepository;