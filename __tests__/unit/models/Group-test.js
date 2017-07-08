import Group from '../../../src/models/Group';

describe('Group', () => {
    it('Cannot create with a undefined player list', () => {
        let anUndefinedPlayerList;
        expect(() => new Group(anUndefinedPlayerList, ['asdfasdf'], 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_PLAYER_LIST);
    });

    it('Cannot create with a null player list', () => {
        let anNullPlayerList = null;
        expect(() => new Group(anNullPlayerList, ['asdfasdf'], 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_PLAYER_LIST);
    });

    it('Cannot create with a non array player list', () => {
        let nonArrayPlayerList = {};
        expect(() => new Group(nonArrayPlayerList, ['asdfasdf'], 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_PLAYER_LIST);
    });

    it('Must have at least one player', () => {
        let noPlayersList = [];
        expect(() => new Group(noPlayersList, ['asdfasdf'], 'description', 'photo', [])).toThrowError(Group.ERRORS.PLAYER_LIST_MUST_CONTAIN_PLAYERS);
    });

    it('Cannot create with a undefined admin list', () => {
        let anUndefinedAdminList;
        expect(() => new Group(['asdfa'], anUndefinedAdminList, 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_ADMIN_LIST);
    });

    it('Cannot create with a null admin list', () => {
        let anNullAdminList = null;
        expect(() => new Group(['asdfa'], anNullAdminList, 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_ADMIN_LIST);
    });

    it('Cannot create with a non array admin list', () => {
        let nonArrayAdminList = {};
        expect(() => new Group(['asdfa'], nonArrayAdminList, 'description', 'photo', [])).toThrowError(Group.ERRORS.INVALID_ADMIN_LIST);
    });

    it('Must have at least one admin', () => {
        let noAdminList = [];
        expect(() => new Group(['asdfa'], noAdminList, 'description', 'photo', [])).toThrowError(Group.ERRORS.ADMIN_LIST_MUST_CONTAIN_PLAYERS);
    });

    it('Admins must be players', () => {
        let players = ['1', '2'];
        let adminNotIncludedInPlayers = ['someOtherId'];
        expect(() => new Group(players, adminNotIncludedInPlayers, 'description', 'photo', [])).toThrowError(Group.ERRORS.ADMINS_MUST_BE_PLAYERS);
    });

    it('Cannot create with a undefined description', () => {
        let anUndefinedDesc;
        expect(() => new Group(['asdfasdf'], ['asdfasdf'], anUndefinedDesc, 'photo', [])).toThrowError(Group.ERRORS.INVALID_DESCRIPTION);
    });

    it('Cannot create with a null description', () => {
        let anNullDesc = null;
        expect(() => new Group(['asdfasdf'], ['asdfasdf'], anNullDesc, 'photo', [])).toThrowError(Group.ERRORS.INVALID_DESCRIPTION);
    });

    it('Can create a valid group', () => {
        let players = ['asdfasdf', 'other'];
        let admins = ['asdfasdf'];
        let desc = 'a group';
        let messages = ['some message'];
        let photo = 'some photo link';
        let group = new Group(players, admins, desc, photo, messages);
        expect(group.players).toHaveLength(players.length);
        expect(group.players).toEqual(expect.arrayContaining(players));
        expect(group.admins).toHaveLength(admins.length);
        expect(group.admins).toEqual(expect.arrayContaining(admins));
        expect(group.messages).toHaveLength(messages.length);
        expect(group.messages).toEqual(expect.arrayContaining(messages));
        expect(group.description).toBe(desc);
        expect(group.photo).toBe(photo);
    });

    it('When creating a new Group and not message past through params, message should be an empty array', () => {
        let group = new Group(['asdfasdf', 'other'], ['asdfasdf'], 'a group', 'some photo link');

        expect(Array.isArray(group.messages)).toBe(true);
        expect(group.messages).toHaveLength(0);
    });

    it('When creating a new Group and not photo past through params, photo should be null', () => {
        let group = new Group(['asdfasdf', 'other'], ['asdfasdf'], 'a group');

        expect(group.photo).toBeNull();
    });

    it('When creating a new Group with repeated players final array must be merged', () => {
        let repeatedPlayers = ['one', 'one', 'two'];
        let result = ['one', 'two'];
        let group = new Group(repeatedPlayers, ['one'], 'a group');

        expect(group.players).toHaveLength(result.length);
        expect(group.players).toEqual(expect.arrayContaining(result));
    });

    it('When creating a new Group with repeated admins final array must be merged', () => {
        let repeatedAdmins = ['one', 'one', 'two'];
        let result = ['one', 'two'];
        let group = new Group(['one', 'two', 'three', 'four'], repeatedAdmins, 'a group');

        expect(group.admins).toHaveLength(result.length);
        expect(group.admins).toEqual(expect.arrayContaining(result));
    });

    it('Cannot add a player a non-admin', () => {
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');

        expect(() => group.addPlayer('someWhoIsAdmin', 'newPlayer')).toThrowError(Group.ERRORS.ACTION_REQUIRE_ADMIN);
    });

    it('Can add a player', () => {
        let result = ['admin', 'noAdmin', 'newPlayer'];
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');
        group.addPlayer('admin', 'newPlayer');

        expect(group.players).toHaveLength(result.length);
        expect(group.players).toEqual(expect.arrayContaining(result));
    });

    it('Adding a duplicated player does not change players array', () => {
        let result = ['admin', 'existingPlayer'];
        let group = new Group(['admin', 'existingPlayer'], ['admin'], 'a group');
        group.addPlayer('admin', 'existingPlayer');

        expect(group.players).toHaveLength(result.length);
        expect(group.players).toEqual(expect.arrayContaining(result));
    });

    it('Cannot make admin a player a non-admin', () => {
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');

        expect(() => group.makeAdmin('noAdmin', 'newPlayer')).toThrowError(Group.ERRORS.ACTION_REQUIRE_ADMIN);
    });

    it('Cannot make admin a player if the player is not member', () => {
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');

        expect(() => group.makeAdmin('admin', 'newPlayer')).toThrowError(Group.ERRORS.PLAYER_IS_NOT_MEMBER);
    });

    it('isMember returns true if a player is a member', () => {
        let member = 'member';
        let admin = 'admin';
        let group = new Group([admin, member], [admin], 'a group');

        expect(group.isMember(member)).toBeTruthy();
        expect(group.isMember(admin)).toBeTruthy();
        expect(group.isMember('noMember')).toBeFalsy();
    });

    it('isAdmin returns true if a player is an admin', () => {
        let noAdmin = 'noAdmin';
        let admin = 'admin';
        let group = new Group([admin, noAdmin], [admin], 'a group');

        expect(group.isAdmin(admin)).toBeTruthy();
        expect(group.isAdmin(noAdmin)).toBeFalsy();
        expect(group.isAdmin('noMember')).toBeFalsy();
    });

    it('Cannot remove a player a non-admin', () => {
        let group = new Group(['admin', 'noAdmin', 'otherNoAdmin'], ['admin'], 'a group');

        expect(() => group.removePlayer('noAdmin', 'otherNoAdmin')).toThrowError(Group.ERRORS.ACTION_REQUIRE_ADMIN);
    });

    it('A player can remove itself', () => {
        let result = ['admin', 'otherNoAdmin'];
        let group = new Group(['admin', 'noAdmin', 'otherNoAdmin'], ['admin'], 'a group');
        group.removePlayer('noAdmin', 'noAdmin');

        expect(group.players).toHaveLength(result.length);
        expect(group.players).toEqual(expect.arrayContaining(result));
    });

    it('A admin can remove itself', () => {
        let playerResult = ['otherAdmin', 'otherNoAdmin'];
        let adminResult = ['otherAdmin'];
        let group = new Group(['admin', 'otherAdmin', 'otherNoAdmin'], ['admin', 'otherAdmin'], 'a group');
        group.removePlayer('admin', 'admin');

        expect(group.players).toHaveLength(playerResult.length);
        expect(group.players).toEqual(expect.arrayContaining(playerResult));
        expect(group.admins).toHaveLength(adminResult.length);
        expect(group.admins).toEqual(expect.arrayContaining(adminResult));
    });

    it('When last admin is removed one player must become admin', () => {
        let result = ['noAdmin'];
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');
        group.removePlayer('admin', 'admin');

        expect(group.players).toHaveLength(result.length);
        expect(group.players).toEqual(expect.arrayContaining(result));
        expect(group.admins).toHaveLength(result.length);
        expect(group.admins).toEqual(expect.arrayContaining(result));
    });

    it('after last player is removed players and admins must be empty', () => {
        let group = new Group(['admin'], ['admin'], 'a group');
        group.removePlayer('admin', 'admin');

        expect(group.players).toHaveLength([].length);
        expect(group.players).toEqual(expect.arrayContaining([]));
        expect(group.admins).toHaveLength([].length);
        expect(group.admins).toEqual(expect.arrayContaining([]));
    });

    it('Can add a message', () => {
        let group = new Group(['admin'], ['admin'], 'a group');
        group.addMessage('admin', 'some text', new Date());
        group.addMessage('admin', 'some text', new Date());

        expect(group.messages).toHaveLength(2);
    });

    it('A non-member cannot add a message', () => {
        let group = new Group(['admin'], ['admin'], 'a group');

        expect(() => group.addMessage('nonMember', 'some text', new Date())).toThrowError(Group.ERRORS.PLAYER_IS_NOT_MEMBER);
    });

    it('When adding a new message must return a message with a new id', () => {
        let date = new Date();
        let group = new Group(['admin'], ['admin'], 'a group');
        let firstMsg = group.addMessage('admin', 'some text', date);
        let secondMsg = group.addMessage('admin', 'some text', date);

        expect(firstMsg.id).toBe(1);
        expect(firstMsg.owner).toBe('admin');
        expect(firstMsg.text).toBe('some text');
        expect(firstMsg.writtenOn).toEqual(date);

        expect(secondMsg.id).toBe(2);
        expect(secondMsg.owner).toBe('admin');
        expect(secondMsg.text).toBe('some text');
        expect(secondMsg.writtenOn).toEqual(date);
    });

    it('A message cannot be updated if player is not the owner', () => {
        let group = new Group(['admin', 'player'], ['admin'], 'a group');
        let msg = group.addMessage('player', 'some text', new Date());

        expect(() => group.updateMessage('admin', msg.id, 'new text', new Date())).toThrowError(Group.ERRORS.PLAYER_IS_NOT_OWNER);
    });

    it('Cannot update a message if it does not exist', () => {
        let group = new Group(['admin', 'player'], ['admin'], 'a group');

        expect(() => group.updateMessage('admin', 1, 'new text', new Date())).toThrowError(Group.ERRORS.INVALID_GROUP_MESSAGE);
    });

    it('Can update a message', () => {
        let newText = 'new text';
        let newDate = new Date();
        let group = new Group(['admin', 'player'], ['admin'], 'a group');
        let msg = group.addMessage('admin', 'oldText', new Date());
        group.updateMessage('admin', msg.id, newText, newDate);

        let updatedMsg = group.messages.find((c) => { return c.id === msg.id });

        expect(updatedMsg.text).toBe(newText);
        expect(updatedMsg.updatedOn).toBe(newDate);
    });

    it('Cannot remove a message if it does not exist', () => {
        let group = new Group(['admin', 'player'], ['admin'], 'a group');

        expect(() => group.removeMessage('admin', 1)).toThrowError(Group.ERRORS.INVALID_GROUP_MESSAGE);
    });

    it('A message cannot be removed if player is not the owner', () => {
        let group = new Group(['admin', 'player'], ['admin'], 'a group');
        let msg = group.addMessage('player', 'some text', new Date());

        expect(() => group.removeMessage('admin', msg.id)).toThrowError(Group.ERRORS.PLAYER_IS_NOT_OWNER);
    });

    it('Can remove a message', () => {
        let group = new Group(['admin', 'player'], ['admin'], 'a group');
        let firstMsg = group.addMessage('admin', 'oldText', new Date());
        let secondMsg = group.addMessage('admin', 'oldText', new Date());
        group.removeMessage('admin', secondMsg.id);

        expect(group.messages).toHaveLength(1);
        expect(group.messages[0].id).toBe(firstMsg.id);
    });
});