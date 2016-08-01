
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
        var mongodb = require('mongodb');
        var ret = false;
        mongodb.MongoClient.connect(this.source, function (err, db) {
            ret = err;
            _db = db;
        });

        return ret;
    }

    isConnected(){
        return !(_db === undefined || _db === null);
    }

    closeConnection(){
        if (this.isConnected()){
            _db = null;
        }
    }

    insert(rootDocument, childDocument){
        if (!this.isConnected()){
            throw new Error(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        }

        if (rootDocument === undefined || rootDocument === null){
            throw new Error(MongoRepository.INVALID_DOCUMENT());
        }

        if (childDocument === undefined || childDocument === null){
            throw new Error(MongoRepository.INVALID_CHILD_DOCUMENT());
        }

        var collection = _db.collection(rootDocument);
        collection.insert(childDocument);
    }

    update(document){
        if (!this.isConnected()){
            throw new Error(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        }
    }

    delete(document){
        if (!this.isConnected()){
            throw new Error(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        }
    }

    get(document, criteria){
        if (!this.isConnected()){
            throw new Error(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        }

        if (document === undefined || document === null){
            throw new Error(MongoRepository.INVALID_DOCUMENT());
        }

        if (criteria === undefined  || criteria === null){
            throw new Error(MongoRepository.INVALID_CRITERIA());
        }

        var collection = _db.collection(document);
        return collection.find(criteria);
    }

    static INVALID_SOURCE() {
        return "El origen de datos debe contener un valor.";
    }

    static CONNECTION_NOT_ESTABLISHED() {
        return "La conexión no fue establecida.";
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
}

module.exports = MongoRepository;