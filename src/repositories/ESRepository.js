import ElasticSearch from 'elasticsearch';
import ValidationHelper from '../helpers/CommonValidator/ValidationHelper';
import NotNullOrUndefinedCondition from '../helpers/CommonValidator/NotNullOrUndefinedCondition';

class ESRepository {
    constructor(client) {
        let conditions = [new NotNullOrUndefinedCondition(client, ESRepository.INVALID_CLIENT)];

        var validator = new ValidationHelper(conditions, () => {
            this.esclient = client;
        }, (err) => { throw new Error(err); });

        validator.execute();
    }

    getById(id, index, type) {
        return new Promise((resolve, reject) => {
            this.esclient.search(this._getQueryForSearchBy({ _id: id }, index, type), (error, response, status) => {
                if (error) {
                    reject(ESRepository.UNEXPECTED_ERROR);
                }
                else {
                    if (response.hits.hits.length > 0) {
                        resolve(response.hits.hits[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    getBy(criteria, index, type) {
        return new Promise((resolve, reject) => {
            this.esclient.search(this._getQueryForSearchBy(criteria, index, type), (error, response, status) => {
                if (error) {
                    reject(ESRepository.UNEXPECTED_ERROR);
                }
                else {
                    resolve(response.hits.hits);
                }
            });
        });
    }

    add(document, index, type) {
        return new Promise((resolve, reject) => {
            this.esclient.index(this._getQueryForAdd(document, index, type), (error, resp) => {
                if (error) {
                    reject(ESRepository.UNEXPECTED_ERROR);
                }
                else {
                    resolve(ESRepository.DOCUMENT_INSERTED);
                }
            });
        });
    }

    _getQueryForSearchBy(criteria, index, type) {
        return {
            index: index,
            type: type,
            body: {
                query: {
                    match: criteria
                }
            }
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

    static get DOCUMENT_INSERTED() {
        return "Document inserted.";
    }

    static get UNEXPECTED_ERROR() {
        return "Unexpected error.";
    }
}

module.exports = ESRepository;