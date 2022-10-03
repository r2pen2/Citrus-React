export const changeTypes = {
    SET: "set",
    REMOVE: "remove",
    ADD: "add",
};

export class Change {
    constructor(_type, _field, _value) {
        this.type = _type;
        this.field = _field;
        this.value = _value;
    }

    toString() {
        return 'Change of type "' + this.type + '" on field "' + this.field + '" with value "' + this.value + '"';
    }
}

export class Set extends Change {
    constructor(_field, _newValue) {
        super(changeTypes.SET, _field, _newValue);
    }
}

export class Remove extends Change {
    constructor(_field, _value) {
        super(changeTypes.REMOVE, _field, _value);
    }
}

export class Add extends Change {
    constructor(_field, _newValue) {
        super(changeTypes.ADD, _field, _newValue);
    }
}