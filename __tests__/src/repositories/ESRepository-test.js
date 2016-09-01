jest.mock('elasticsearch');

import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  var es = require('elasticsearch');
  
  it('Cannot create with an undefined ESClient', () => {
    let undefinedESClient;

    expect(() => new ESRepository(undefinedESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Cannot create with a null ESClient', () => {
    let nullESClient = null;

    expect(() => new ESRepository(nullESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Can create a valid ESRepository', () => {
    let es = require('elasticsearch');
    es.Client = jest.fn();
    let client = new es.Client();
    
    let repo = new ESRepository(client);

    expect(repo.esclient).toEqual(client);
  });

  pit('Can get a document by id ', () => {
    //let es = require('elasticsearch'); lo pongo a nivel de clase
    var client = new es.Client();
    client.search = jes.fn((criteria, callback) => { console.log('cuando llame al seacrh, vas a ver esto'); callback(false, 'algo que retorne'); }); // Simulo el comportamiento que deseo
    
        //     index: app,
        //     type: type,
        //     body: {
        //         query: {
        //             match: {
        //                 _id: id
        //             }
        //         }
        //     }
    
    let repo = new ESRepository(client);
    repo.getById('id', 'index', 'type'); //ejecuto el metodo, pero creo que tenes que armar un promise
    .then((objectReturned) => {
        expect(repo.esclient.search.mock.calls[0][0].index).toEqual('index');
        expect(repo.esclient.search.mock.calls[0][1].type).toEqual('type');
        expect(repo.esclient.search.mock.calls[0][2].body.query.match._id).toEqual('id');
    });
  });
});
