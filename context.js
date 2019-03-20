module.exports = {
    get query() {
        return this.request.query;
    },
    get status() {
        return this.response.status;
    },
    set status(code) {
        this.response.status = code;
    },
    get body() {
        return this.response.body;
    },
    set body(data) {
        this.response.body = data;
    }
};
