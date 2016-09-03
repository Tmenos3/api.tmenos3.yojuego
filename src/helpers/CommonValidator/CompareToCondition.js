import Condition from './Condition';

class CompareToCondition extends Condition {
    constructor(x, compareCriteria, y, err) {
        super(err);

        if (this._isNullOrUndefined(compareCriteria) || (!(['GR', 'GRE', 'LS', 'LSE', 'EQ'].indexOf(compareCriteria) >= 0))) {
            throw new Error(CompareToCondition.INVALID_COMPARE_CRITERIA());
        } else {
            this._x = x;
            this._y = y;
            this._compareCriteria = compareCriteria;
        }
    }

    isValid() {
        switch (this._compareCriteria) {
            case 'GR':
                return this._x > this._y;
            case 'GRE':
                return this._x >= this._y;
            case 'LS':
                return this._x < this._y;
            case 'LSE':
                return this._x <= this._y;
            case 'EQ':
                return this._x == this._y;
            default:
                return false;
        };
    }

    static INVALID_COMPARE_CRITERIA() {
        return 'El criterio de comparacion es invalido. Validos: GR, GRE, LS, LSE, EQ';
    }
}

module.exports = CompareToCondition;
