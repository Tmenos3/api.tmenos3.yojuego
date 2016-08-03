
 var _db;

 class MongoRepository {
    constructor(source){
        if(source === undefined || source === null){
            throw new Error(MongoRepository.INVALID_SOURCE());
        }

        this.source = source;
        _db = null;
        //var url = 'mongodb://localhost:27017/yojuego';
    }

    connect(){
        return new Promise( (resolve, reject) => {
            var mongodb = require('mongodb');
            mongodb.MongoClient.connect(this.source, function (err, db) {
                if (!err){
                    _db = db;
                    resolve(MongoRepository.CONNECTION_ESTABLISHED());
                }else{
                    reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
                }
            });
        });
    }

    closeConnection(){
        return new Promise( (resolve, reject) => {
            if (_db === null || _db === undefined){
                reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
            }else{
                _db.close();
                _db = null;
                resolve();
            }
        });
    }

    insert(rootDocument, childDocument){
        return new Promise( (resolve, reject) => {
            if (rootDocument === undefined || rootDocument === null){
                reject(MongoRepository.INVALID_DOCUMENT());
            }else{
                if (childDocument === undefined || childDocument === null){
                    reject(MongoRepository.INVALID_CHILD_DOCUMENT());
                }else{
                    if (_db === null || _db === undefined){
                        reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
                    }else{
                        var collection = _db.collection(rootDocument);
                        collection.insert(childDocument);
                        resolve(MongoRepository.DOCUMENT_INSERTED());
                    }
                }
            }
        });
    }

    update(document){
        return new Promise( (resolve, reject) => {
            reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        });
    }

    delete(document){
        return new Promise( (resolve, reject) => {
            reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        });
    }

    get(document, criteria){
        return new Promise( (resolve, reject) => {
            if (document === undefined || document === null){
                reject(MongoRepository.INVALID_DOCUMENT());
            }else{
                if (criteria === undefined  || criteria === null){
                    reject(MongoRepository.INVALID_CRITERIA());
                }else{
                    if (_db === null || _db === undefined){
                        reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
                    }else{
                        var collection = _db.collection(document);
                        resolve(collection.find(criteria));
                    }
                }
            } 
        });
    }

    static INVALID_SOURCE() {
        return "El origen de datos debe contener un valor.";
    }

    static CONNECTION_NOT_ESTABLISHED() {
        return "La conexión no fue establecida.";
    }

    static CONNECTION_ESTABLISHED() {
        return "La conexión fue establecida exitosamente.";
    }

    static INVALID_DOCUMENT() {
        return "Debe proporcionar un documento valido.";
    }

    static INVALID_CRITERIA() {
        return "Debe proporcionar un criterio valido.";
    }

    static INVALID_CHILD_DOCUMENT() {
        return "El elemento a insertar no es válido.";
    }

    static DOCUMENT_INSERTED() {
        return "Documento insertado correctamente";
    }
}

module.exports = MongoRepository;