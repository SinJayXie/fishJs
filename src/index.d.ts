import { IncomingMessage, ServerResponse } from 'http';
import DbBase from './libs/DbBase';
import { ParsedUrlQuery } from 'node:querystring';

interface ListenerConfig {
    port: number,
    host: string,
    path: string
}

interface FishRequest {
    path: string,
    url: string,
    method: string,
    query: ParsedUrlQuery,
    body: any,
    httpReq: IncomingMessage,
    httpRes: ServerResponse,
    sql: DbBase
}
