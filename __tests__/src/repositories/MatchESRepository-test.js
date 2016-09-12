import MatchESRepository from '../../../src/repositories/MatchESRepository';
import Match from '../../../src/models/Match';

describe('MatchESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); })
        }
    };

    pit('Can get a match by id ', () => {
        let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'matchType');
        match.createdOn = new Date('2016-01-01T00:00:00.000Z');
        match.id = 'id';
        let client = getMockedClient(false, { _id: match.id, source: match });
        let repo = new MatchESRepository(client);
        
        return repo.getById(match.id)
            .then((matchReturned) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('match');
                expect(client.get.mock.calls[0][0].id).toEqual(match.id);
                expect(matchReturned).toEqual(match);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can get list of matches by criteria ', () => {
        var matches = [
            { _id: 'anyValidId', _source: { tittle: 'tittle', date: new Date(2016, 1, 1), fromTime: '19:00', toTime: '20:00', location: 'location', creator: 'iuahscmjalnj', matchType: 'matchType', createdOn: new Date('2016-01-01T00:00:00.000Z') } },
            { _id: 'otherValidId', _source: { tittle: 'otherTittle', date: new Date(2016, 12, 31), fromTime: '01:00', toTime: '02:00', location: 'other_location', creator: 'iopu78at6hoq2e_98y', matchType: 'matchType', createdOn: new Date('2016-01-01T00:00:00.000Z') } },
        ];
        var criteria = { criteria: 'anyCriteria' };
        let client = getMockedClient(false, { hits: { hits: matches } });

        let repo = new MatchESRepository(client);
        return repo.getBy(criteria)
            .then((matchesReturned) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('match');
                expect(client.search.mock.calls[0][0].body.query.match).toEqual(criteria);
                expect(matches.length).toEqual(matches.length);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'matchType');
        let client = getMockedClient(false, {});

        let repo = new MatchESRepository(client);
        return repo.add(match)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('match');
                expect(client.index.mock.calls[0][0].body.title).toEqual(match.title);
                expect(client.index.mock.calls[0][0].body.date).toEqual(match.date);
                expect(client.index.mock.calls[0][0].body.fromTime).toEqual(match.fromTime);
                expect(client.index.mock.calls[0][0].body.toTime).toEqual(match.toTime);
                expect(client.index.mock.calls[0][0].body.location).toEqual(match.location);
                expect(client.index.mock.calls[0][0].body.creator).toEqual(match.creator);
                expect(client.index.mock.calls[0][0].body.matchType).toEqual(match.matchType);
                expect(resp.message).toEqual(MatchESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });
});
