import MatchESRepository from '../../../src/repositories/MatchESRepository';
import Match from '../../../src/models/Match';

describe('MatchESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); }),
            update: jest.fn((document, callback) => { callback(err, ret) })
        }
    };

    pit('Can get a match', () => {
        let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'matchType');
        match._id = 'id';
        let client = getMockedClient(false, { _id: match._id, source: match });
        let repo = new MatchESRepository(client);

        return repo.get(match._id)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('match');
                expect(client.get.mock.calls[0][0].id).toEqual(match._id);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(match._id);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'matchType');
        match._id = 'id';
        let client = getMockedClient(false, { _id: match._id, _source: match });

        let repo = new MatchESRepository(client);
        return repo.add(match)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('match');
                expect(client.index.mock.calls[0][0].body).toEqual(match);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(match._id);
                expect(resp.message).toEqual(MatchESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Cannot add a match if it is not instanceOf Match', () => {
        let notInstanceOfMatch = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.add(notInstanceOfMatch)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.INVALID_INSTANCE_PLAYER);
            });
    });

    pit('Cannot update a match if it is not instanceOf Match', () => {
        let notInstanceOfMatch = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.update(notInstanceOfMatch)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.INVALID_INSTANCE_PLAYER);
            });
    });

    pit('Can update a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'matchType');
        match._id = 'id';
        let client = getMockedClient(false, { _id: match._id, _source: match });

        let repo = new MatchESRepository(client);
        return repo.update(match)
            .then((resp) => {
                expect(client.update.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.update.mock.calls[0][0].type).toEqual('match');
                expect(client.update.mock.calls[0][0].id).toEqual(match._id);
                expect(client.update.mock.calls[0][0].body.doc).not.toBeNull();
                expect(client.update.mock.calls[0][0].body.doc).not.toBeUndefined();

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(match._id);
                expect(resp.message).toEqual(MatchESRepository.DOCUMENT_UPDATED);
            }, (err) => { console.log('err: ' + JSON.stringify(err)); expect(true).toEqual(false) });
    });
});
