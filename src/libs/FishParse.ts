import { IncomingMessage, ServerResponse } from 'http';
import { FishRequest } from '../index';
import * as url from 'url';
import DbBase from './DbBase';

class FishParse {
    private readonly request: IncomingMessage;
    private readonly response: ServerResponse;
    private readonly sqlConnect: DbBase;
    private readonly body: any;
    constructor(req: IncomingMessage, res: ServerResponse, sqlConnect: DbBase, body_: any) {
        this.request = req;
        this.response = res;
        this.sqlConnect = sqlConnect;
        this.body = body_;
    }

    public parse = () => {
        const urlObject = url.parse(this.request.url, true);
        const parseObject: FishRequest = {
            path: urlObject.pathname,
            query: urlObject.query,
            body: this.body,
            method: this.request.method,
            url: this.request.url,
            sql: this.sqlConnect,
            httpReq: this.request,
            httpRes: this.response

        };
        return parseObject;
    }
}

export default FishParse;
