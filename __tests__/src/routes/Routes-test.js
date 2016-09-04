import Routes from '../../../src/routes/Routes';

describe('Routes', () => {
    it('Cannot add routes with an undefined server', () => {
        let undefinedServer;
        let routes = new Routes();

        expect(() => routes.add(undefinedServer)).toThrowError(Routes.INVALID_SERVER);
    });

    it('Cannot add routes with an null server', () => {
        let nullServer;
        let routes = new Routes();

        expect(() => routes.add(nullServer)).toThrowError(Routes.INVALID_SERVER);
    });
});