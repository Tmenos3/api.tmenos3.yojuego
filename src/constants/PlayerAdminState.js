class PlayerAdminState {

    static get enabled() { return { code: 0, value: 'Habilitado' } };
    static get disabled() { return { code: 1, value: 'Deshabilitado' } };
}

module.exports = PlayerAdminState;