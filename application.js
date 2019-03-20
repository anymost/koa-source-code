const http = require('http');
const Event = require('events');
const request = require('./request');
const response = require('./response');
const context = require('./context');

class Koa extends Event{
    constructor() {
        super();
        this.context = context;
        this.request = request;
        this.response = response;
        this.middlewares = [];
    }

    use(fn) {
        this.middlewares.push(fn);
    }

    compose() {
        return async (ctx) => {
            function createNext(middleware, next) {
                return  async()  => {
                    return await middleware(ctx, next)
                }
            }
            const length = this.middlewares.length;
            let next = async () => await Promise.resolve();
            for (let i = length - 1; i >= 0; i--) {
                next = createNext(this.middlewares[i], next);
            }
            await next();
        }
    }

    callback() {
        return (req, res) => {
            const ctx = this.createContext(req, res);
            const responseEnd = () => this.responseEnd(ctx);
            const fn = this.compose();
            const onError = (err) => this.handleError(ctx, err);
            fn(ctx).then(responseEnd).catch(onError);
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }

    createContext(req, res) {
        const ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    responseEnd(ctx) {
        if (typeof ctx.body === 'object') {
            ctx.res.end(JSON.stringify(ctx.body));
        } else {
            ctx.res.end(ctx.body);
        }
    }

    handleError(ctx, err) {
        console.log(ctx, err);
        if (err.code === 'ENOENT') {
            ctx.status = 404;
            ctx.res.end('not found')
        }
        else {
            ctx.status = 500;
            ctx.res.end('internal server error');
        }
        this.emit('error', error);
    }
}
