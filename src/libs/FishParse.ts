import { IncomingMessage, ServerResponse } from 'http';
import { FishRequest, ListenerConfig } from '../index';
import * as url from 'url';
import DbBase from './DbBase';
import TemplateBase from './TemplateBase';

class FishParse {
    private readonly request: IncomingMessage;
    private readonly response: ServerResponse;
    private readonly sqlConnect: DbBase;
    private readonly body: any;
    private templateEngine: TemplateBase;
    private config: ListenerConfig;
    constructor(req: IncomingMessage, res: ServerResponse, sqlConnect: DbBase, body_: any, config: ListenerConfig) {
        this.request = req;
        this.response = res;
        this.sqlConnect = sqlConnect;
        this.body = body_;
        this.config = config;

    }

    public parse = () => {
        const urlObject = url.parse(this.request.url, true);
        this.templateEngine = new TemplateBase(this.config.path, urlObject.pathname);
        const parseObject: FishRequest = {
            path: urlObject.pathname,
            query: urlObject.query,
            body: this.body,
            method: this.request.method,
            url: this.request.url,
            sql: this.sqlConnect,
            httpReq: this.request,
            httpRes: this.response,
            templateEngine: this.templateEngine
        };
        return parseObject;
    }
}

export default FishParse;
