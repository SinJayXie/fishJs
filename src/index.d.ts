import { IncomingMessage, ServerResponse } from 'http';
import DbBase from './libs/DbBase';
import { ParsedUrlQuery } from 'node:querystring';
import TemplateBase from './libs/TemplateBase';
import { SessionController } from './libs/Session';

interface ListenerConfig {
    port: number,
    host: string,
    path: string,
    ssl: {
        key: string,
        cert: string
    }
}

interface FishRequest {
    path: string,
    url: string,
    method: string,
    query: ParsedUrlQuery,
    body: any,
    httpReq: IncomingMessage,
    httpRes: ServerResponse,
    sql: DbBase,
    templateEngine: TemplateBase,
    session: SessionController
}
