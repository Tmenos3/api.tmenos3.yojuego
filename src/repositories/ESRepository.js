import ElasticSearch from 'elasticsearch';
import ValidationHelper from '../helpers/CommonValidator/ValidationHelper';
import NotNullOrUndefinedCondition from '../helpers/CommonValidator/NotNullOrUndefinedCondition';
import RegexCondition from '../helpers/CommonValidator/RegexCondition';

const uriRegex = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';

class ESRepository {
    constructor(uri) {
        let conditions = [
            new NotNullOrUndefinedCondition(uri, ESRepository.INVALID_SOURCE),
            new RegexCondition(uri, uriRegex, ESRepository.INVALID_SOURCE)
        ];

        new ValidationHelper(conditions, () => {
            this._soruce = uri;
            this._esclient = new ElasticSearch.Client({
                host: uri + ':9200',
                log: 'trace'
            });
        }, (err) => { throw new Error(err); })
            .execute();
    }

    static get INVALID_SOURCE() {
        return "Invalid Source";
    }

    get Source() {
        return this._soruce;
    }

    get ESClient() {
        return this._esclient;
    }
}

module.exports = ESRepository;