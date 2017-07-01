import ClubESRepository from '../../../src/repositories/ClubESRepository';
import Club from '../../../src/models/club/Club';

describe('ClubESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); }),
            update: jest.fn((document, callback) => { callback(err, ret) })
        }
    };

    pit('Can get a club', () => {
        // let club = new Club('club', new Date(2016, 1, 1), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'clubType');
        // club._id = 'id';
        // let client = getMockedClient(false, { _id: club._id, source: club });
        // let repo = new ClubESRepository(client);

        // return repo.get(club._id)
        //     .then((resp) => {
        //         expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
        //         expect(client.get.mock.calls[0][0].type).toEqual('club');
        //         expect(client.get.mock.calls[0][0].id).toEqual(club._id);

        //         expect(resp.code).toEqual(200);
        //         expect(resp.message).toBeNull();
        //         expect(resp.resp._id).toEqual(club._id);
        //     }, (err) => expect(true).toEqual(false));
    });

    // pit('Can add a club', () => {
    //     let club = new Club('club', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'clubType');
    //     club._id = 'id';
    //     let client = getMockedClient(false, { _id: club._id, _source: club });

    //     let repo = new ClubESRepository(client);
    //     return repo.add(club)
    //         .then((resp) => {
    //             expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
    //             expect(client.index.mock.calls[0][0].type).toEqual('club');
    //             expect(client.index.mock.calls[0][0].body).toEqual(club);

    //             expect(resp.code).toEqual(200);
    //             expect(resp.resp._id).toEqual(club._id);
    //             expect(resp.message).toEqual(ClubESRepository.DOCUMENT_INSERTED);
    //         }, (err) => expect(true).toEqual(false));
    // });

    pit('Cannot add a club if it is not instanceOf Club', () => {
        let notInstanceOfClub = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new ClubESRepository(client);
        return repo.add(notInstanceOfClub)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(ClubESRepository.INVALID_INSTANCE_CLUB);
            });
    });

    // pit('Cannot update a club if it is not instanceOf Club', () => {
    //     let notInstanceOfClub = {};
    //     let client = getMockedClient(false, { _id: 'id', _source: {} });

    //     let repo = new ClubESRepository(client);
    //     return repo.update(notInstanceOfClub)
    //         .then((resp) => (err) => expect(true).toEqual(false),
    //         (err) => {
    //             expect(err.code).toEqual(410);
    //             expect(err.message).toEqual(ClubESRepository.INVALID_INSTANCE_PLAYER);
    //         });
    // });

    // pit('Can update a club', () => {
    //     let club = new Club('club', new Date('2016-01-01'), '19:00', '20:00', 'location', 'alkjsd_fiaopusdn', 'clubType');
    //     club._id = 'id';
    //     let client = getMockedClient(false, { _id: club._id, _source: club });

    //     let repo = new ClubESRepository(client);
    //     return repo.update(club)
    //         .then((resp) => {
    //             expect(client.update.mock.calls[0][0].index).toEqual('yojuego');
    //             expect(client.update.mock.calls[0][0].type).toEqual('club');
    //             expect(client.update.mock.calls[0][0].id).toEqual(club._id);
    //             expect(client.update.mock.calls[0][0].body.doc).not.toBeNull();
    //             expect(client.update.mock.calls[0][0].body.doc).not.toBeUndefined();

    //             expect(resp.code).toEqual(200);
    //             expect(resp.resp._id).toEqual(club._id);
    //             expect(resp.message).toEqual(ClubESRepository.DOCUMENT_UPDATED);
    //         }, (err) => { console.log('err: ' + JSON.stringify(err)); expect(true).toEqual(false) });
    // });
});
