 var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
 var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');

 class MongoRepository {
    constructor(source){
        var conditions = [new NotNullOrUndefinedCondition(source, MongoRepository.INVALID_SOURCE())];
        var validator = new ValidationHelper(conditions, () => this.source = source, (err) => { throw new Error(err) });
        validator.execute();
        //var url = 'mongodb://localhost:27017/yojuego';
    }

    _connect(){
        return new Promise( (resolve, reject) => {
            var mongodb = require('mongodb');
            mongodb.MongoClient.connect(this.source, (err, db) => { this._doAfterConnect(err, db, resolve, reject); } );
        });
    }

    insert(rootDocument, childDocument){
        return new Promise((resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT()),
                new NotNullOrUndefinedCondition(childDocument, MongoRepository.INVALID_CHILD_DOCUMENT())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidateInsert(rootDocument, childDocument, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    update(rootDocument, id, toUpdate){
        return new Promise( (resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT()),
                new NotNullOrUndefinedCondition(id, MongoRepository.INVALID_ID()),
                new NotNullOrUndefinedCondition(toUpdate, MongoRepository.INVALID_DATA_TO_UPDATE())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidateUpdate(rootDocument, id, toUpdate, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    delete(rootDocument, criteria){
        return new Promise( (resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT()),
                new NotNullOrUndefinedCondition(criteria, MongoRepository.INVALID_CRITERIA())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidaDelete(rootDocument, criteria, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    getOne(rootDocument, criteria){
        return new Promise( (resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT()),
                new NotNullOrUndefinedCondition(criteria, MongoRepository.INVALID_CRITERIA())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidateGetOne(rootDocument, criteria, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    getBy(rootDocument, criteria){
        return new Promise( (resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT()),
                new NotNullOrUndefinedCondition(criteria, MongoRepository.INVALID_CRITERIA())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidateGetBy(rootDocument, criteria, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    getAll(rootDocument){
        return new Promise( (resolve, reject) => {
            var conditions = [
                new NotNullOrUndefinedCondition(rootDocument, MongoRepository.INVALID_DOCUMENT())
            ];
            
            var validator = new ValidationHelper(conditions, () => { this._doAfterValidateGetAll(rootDocument, resolve, reject); }, (err) => reject(err));
            validator.execute();
        });
    }

    _doAfterConnect(err, db, resolve, reject) {
        if (!err){
            resolve(db);
        }else{
            reject(MongoRepository.CONNECTION_NOT_ESTABLISHED());
        }
    }

    _doAfterValidateInsert(rootDocument, childDocument, resolve, reject) { 
        this._connect()
            .then((db) => { 
                    var collection = db.collection(rootDocument);
                    collection.insert(childDocument, (err, result) => { this._doAfterInsert(db, err, resolve, reject); });
                }, (err) => reject(err))
            .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterValidateUpdate(rootDocument, id, toUpdate, resolve, reject){
        this._connect()
        .then((db) => {
                var collection = db.collection(rootDocument); 
                collection.update(id, {$set: toUpdate}, (err, result) => { this._doAfterUpdate(db, err, resolve, reject); });
            }, (err) => reject(err))
        .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterValidaDelete(rootDocument, criteria, resolve, reject){
        this._connect()
        .then((db) => {
                var collection = db.collection(rootDocument);  
                collection.deleteOne(criteria, (err, results) => { this._doAfterDelete(db, err, resolve, reject); });
            }, (err) => reject(err))
        .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterValidateGetOne(rootDocument, criteria, resolve, reject){
        this._connect()
        .then((db) => {
            var ret = db.collection(rootDocument).findOne(criteria);
            db.close();
            resolve(ret);
        }, (err) => reject(err))
        .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterValidateGetBy(rootDocument, criteria, resolve, reject){
        this._connect()
        .then((db) => {
             db.collection(rootDocument).find(criteria).toArray((err, documents) => {
               db.close();
               resolve(documents);
             });
        }, (err) => reject(err))
        .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterValidateGetAll(rootDocument, resolve, reject){
        this._connect()
        .then((db) => {
            db.collection(rootDocument).find({}).toArray((err, documents) => {
                db.close();
                resolve(documents);
            });
        }, (err) => reject(err))
        .catch((err) => reject(MongoRepository.UNEXPECTED_ERROR()));
    }

    _doAfterInsert(db, err, resolve, reject){
        db.close();
        if (err){
            reject(MongoRepository.ERROR_WHILE_INSERTING());
        }else{    
            resolve(MongoRepository.DOCUMENT_INSERTED());
        }
    }

    _doAfterUpdate(db, err, resolve, reject){
        db.close();
        if (err){
            reject(MongoRepository.ERROR_WHILE_UPDATING());
        }else{    
            resolve(MongoRepository.DOCUMENT_UPDATED());
        }
    }

    _doAfterDelete(db, err, resolve, reject){ 
        db.close();
        if (err){
            reject(MongoRepository.ERROR_WHILE_DELETING());
        }else{
            resolve(MongoRepository.DOCUMENT_DELETED());
        } 
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

    static INVALID_ID() {
        return "Debe proporcionar un id válido.";
    }

    static INVALID_DATA_TO_UPDATE(){
        return "Debe proporcionar data para actualizar valida.";
    }

    static DOCUMENT_INSERTED() {
        return "Documento insertado correctamente";
    }

    static DOCUMENT_UPDATED() {
        return "Documento actualizado correctamente";
    }

    static DOCUMENT_DELETED() {
        return "Documento eliminad correctamente";
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

    static ERROR_WHILE_UPDATING(){
        return 'No se ha podido actualizar el documento';
    }
}

module.exports = MongoRepository;