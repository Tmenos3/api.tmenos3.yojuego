
 var _db;

 var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

 class MongoRepository {
    constructor(source){
        if (isNullOrUndefined(source)){
            throw new Error(MongoRepository.INVALID_SOURCE());
        }

        this.source = source;
        _db = null;
        //var url = 'mongodb://localhost:27017/yojuego';
    }

    _connect(){
        return new Promise( (resolve, reject) => {
            var mongodb = require('mongodb');
            mongodb.MongoClient.connect(this.source, function (err, db) {
                if (!err){
                    resolve(db);
                }else{
                    reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
                }
            });
        });
    }

    insert(rootDocument, childDocument){
        return new Promise((resolve, reject) => {
            if (isNullOrUndefined(rootDocument)){
                reject(MongoRepository.INVALID_DOCUMENT());
            }else{
                if (isNullOrUndefined(childDocument)){
                    reject(MongoRepository.INVALID_CHILD_DOCUMENT());
                }else{
                    this._connect()
                    .then((db) => {
                                    db.collection(rootDocument).insert(childDocument, (err, result) =>{
                                        db.close();
                                        if (err){
                                            reject(MongoRepository.ERROR_WHILE_INSERTING());
                                        }else{    
                                            resolve(MongoRepository.DOCUMENT_INSERTED());
                                        }
                                    });
                                  }, (err) => reject(err))
                    .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
                }
            }
        });
    }

    update(document){
        return new Promise( (resolve, reject) => {
            reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        });
    }

    delete(rootDocument, criteria){
        return new Promise( (resolve, reject) => {
            if (isNullOrUndefined(rootDocument)){
                reject(MongoRepository.INVALID_DOCUMENT());
            }else{
                if (isNullOrUndefined(criteria)){
                    reject(MongoRepository.INVALID_CRITERIA());
                }else{
                    this._connect()
                    .then((db) => {
                        db.collection(rootDocument).deleteOne(criteria, (err, results) => { 
                            db.close();
                            if (err){
                                reject(MongoRepository.ERROR_WHILE_DELETING());
                            }else{
                                resolve();
                            } 
                        });
                    }, (err) => reject(err))
                    .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
                }
            }
        });
    }

    get(document, criteria){
        return new Promise( (resolve, reject) => {
            if (isNullOrUndefined(document)){
                reject(MongoRepository.INVALID_DOCUMENT());
            }else{
                if (isNullOrUndefined(criteria)){
                    reject(MongoRepository.INVALID_CRITERIA());
                }else{
                    this._connect()
                    .then((db) => {
                        var ret = db.collection(document).find(criteria);
                        db.close();
                        resolve(ret);
                    }, (err) => reject(err))
                    .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
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

    static UNEXPECTED_ERROR(){
        return 'Error inesperado';
    }

    static ERROR_WHILE_DELETING(){
        return 'No se ha podido eliminar el documento';
    }

    static ERROR_WHILE_INSERTING(){
        return 'No se ha podido eliminar el documento';
    }
}

module.exports = MongoRepository;