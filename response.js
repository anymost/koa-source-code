module.exports = {
    get status() {
        return this.res.statusCode;
    },
    set status(code) {
        if (typeof code !== 'number') {
            throw new Error('code must be number');
        }
        this.res.statusCode = code;
    },
    set body(data) {
        this._data = data;
    },
    get body() {
        return this._data;
    }
};
