import MatchESRepository from '../../../src/repositories/MatchESRepository';
import Match from '../../../src/models/Match';
import getMockedClient from '../../__tools__/mockedESClient';

describe('MatchESRepository', () => {
    it('Can get a match', () => {
        let match = new Match('match', new Date(2016, 1, 1), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', Match.TYPES.FIVE);
        match._id = 'id';
        let client = getMockedClient(false, { _id: match._id, _source: match });
        let repo = new MatchESRepository(client);

        return repo.get(match._id)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('match');
                expect(client.get.mock.calls[0][0].id).toEqual(match._id);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(match._id);
                expect(resp.resp instanceof Match).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can add a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', Match.TYPES.FIVE);
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
                expect(resp.message).toEqual(MatchESRepository.MESSAGES.DOCUMENT_INSERTED);
                expect(resp.resp instanceof Match).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot add a match if it is not instanceOf Match', () => {
        let notInstanceOfMatch = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.add(notInstanceOfMatch)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH);
            });
    });

    it('Cannot update a match if it is not instanceOf Match', () => {
        let notInstanceOfMatch = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.update(notInstanceOfMatch)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH);
            });
    });

    it('Cannot delete a match if it is not instanceOf Match', () => {
        let notInstanceOfMatch = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.delete(notInstanceOfMatch)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH);
            });
    });

    it('Can update a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', Match.TYPES.FIVE);
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
                expect(resp.message).toEqual(MatchESRepository.MESSAGES.DOCUMENT_UPDATED);
                expect(resp.resp instanceof Match).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can delete a match', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', Match.TYPES.FIVE);
        match._id = 'internalId';
        let client = getMockedClient(false, { _id: match._id, _source: match });

        let repo = new MatchESRepository(client);
        return repo.delete(match)
            .then((resp) => {
                expect(client.delete.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.delete.mock.calls[0][0].type).toEqual('match');
                expect(client.delete.mock.calls[0][0].id).toEqual(match._id);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(match._id);
                expect(resp.message).toEqual(MatchESRepository.MESSAGES.DOCUMENT_DELETED);
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot get a matches by playerid and date if playerid is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.getByPlayerIdAndDate(null, new Date())
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_PLAYERID);
            });
    });

    it('Cannot get a matches by playerid and date if playerid is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.getByPlayerIdAndDate(undefined, new Date())
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_PLAYERID);
            });
    });

    it('Cannot get a matches by playerid and date if date is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.getByPlayerIdAndDate('playerId', null)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_DATE);
            });
    });

    it('Cannot get a matches by playerid and date if date is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new MatchESRepository(client);
        return repo.getByPlayerIdAndDate('playerid', undefined)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(MatchESRepository.ERRORS.INVALID_DATE);
            });
    });

    it('Can get matches by playerid and date ', () => {
        let match = new Match('match', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', Match.TYPES.FIVE);
        let result = [{ _id: 'internalId', _source: match }];
        let client = getMockedClient(false, result);
        let playerId = 'playerId';
        let date = new Date();

        let repo = new MatchESRepository(client);
        return repo.getByPlayerIdAndDate(playerId, date)
            .then((resp) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('match');
                expect(client.search.mock.calls[0][0].body.query.bool.should[0].term.confirmedPlayers.value).toEqual(playerId);
                expect(client.search.mock.calls[0][0].body.query.bool.should[1].term.pendingPlayers.value).toEqual(playerId);
                expect(client.search.mock.calls[0][0].body.query.bool.should[2].term.canceledPlayers.value).toEqual(playerId);
                expect(client.search.mock.calls[0][0].body.query.bool.should[3].term.creator.value).toEqual(playerId);
                expect(client.search.mock.calls[0][0].body.query.bool.must[0].range.date.gte).toEqual(date);
                expect(client.search.mock.calls[0][0].body.query.bool.must[0].range.date.format).toEqual("dd/MM/yyyy");
                expect(client.search.mock.calls[0][0].body.query.bool.minimum_should_match).toEqual(1);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp).toHaveLength(result.length);
            }, (err) => { expect(true).toEqual(false) });
    });
});
