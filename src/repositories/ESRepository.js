import ElasticSearch from 'elasticsearch';
import ValidationHelper from '../helpers/CommonValidator/ValidationHelper';
import NotNullOrUndefinedCondition from '../helpers/CommonValidator/NotNullOrUndefinedCondition';
import RegexCondition from '../helpers/CommonValidator/RegexCondition';

const uriRegex = "(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?";

class ESRepository {
    constructor(client) {
        let conditions = [
            new NotNullOrUndefinedCondition(client, ESRepository.INVALID_CLIENT),
            //new RegexCondition(uri, uriRegex, ESRepository.INVALID_SOURCE)
        ];

        new ValidationHelper(conditions, () => {
            this.esclient = client;
        }, (err) => { throw new Error(err); })
            .execute();
    }

    getById(app, type, id){
        // cli.search({  
        //     index: app,
        //     type: type,
        //     body: {
        //         query: {
        //             match: {
        //                 _id: id
        //             }
        //         }
        //     }
        // },function (error, response,status) {
        //     if (error){
        //         res.json(error);
        //     }
        //     else {
        //         response.hits.hits.forEach(function(hit){
        //         console.log(JSON.stringify(hit));
        //         res.json(hit);
        //         });
        //     }
        // });
    }

    static get INVALID_CLIENT() {
        return "Invalid Client";
    }
}

module.exports = ESRepository;