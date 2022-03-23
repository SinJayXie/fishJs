import { FishRequest } from '../index';
import * as fs from 'fs';
import { CreateReadStreamOptions } from 'fs/promises';
import { Data } from 'ejs';

class R {
    private data: {};
    fishBase: FishRequest;
    constructor() {
        this.data = {};
    }
    public __setRes__ = (res: FishRequest) => {
        this.fishBase = res;
    }

    public render = async (data: Data) => {
        this.setHeader('Content-Type', 'text/html; charset=utf-8');
        return await this.fishBase.templateEngine.render(data, this.fishBase.httpRes);
    }

    public wait = () => {
        return '__wait_process__';
    }
    public body = () => {
        return this.fishBase.body;
    }
    public setMethod = (method: string) => {
        if(this.fishBase.method.toLocaleUpperCase() !== method.toUpperCase()) {
            throw Error(`Not arrow method '${this.fishBase.method}'`);
        }
    }
    public sendFile = (downPath: string, fileName: string, readOption: CreateReadStreamOptions) => {
        if(fs.existsSync(downPath)) {
            const stat = fs.statSync(downPath);
            if(stat.isFile()) {
                this.setHeader('Content-Length', stat.size + '');
                this.setHeader('Content-Disposition', 'attachment;filename=' + encodeURIComponent(fileName));
                const fsStream = fs.createReadStream(downPath, readOption);
                fsStream.on('error', (err: { message: string; }) => {
                    console.log(err);
                    throw Error(err.message);
                });
                fsStream.on('data', (chunk: any) => {
                    this.write(chunk);
                });
                fsStream.on('end', () => {
                    fsStream.close();
                    this.end();
                });

                return this.wait();
            } else {
                return this.fail(404, 'File not found');
            }
        } else {
            return this.fail(404, 'File not found');
        }
    }
    public write = (chunk: any) => {
        this.fishBase.httpRes.write(chunk);
    }
    public end = () => {
        this.fishBase.httpRes.end();
    }
    public setHeader = (key: string, value: string) => {
        this.fishBase.httpRes.setHeader(key, value);
    }
    public setStatusCode = (code: number) => {
        this.fishBase.httpRes.statusCode = code;
    }
    public setCookie = (name: string, value: string) => {
        this.setHeader('Set-Cookie', `${name}=${value}`);
    }
    public getHeader = () => {
        return this.fishBase.httpReq.headers;
    }
    public getCookie = () => {
        const Cookies: any = {};
        if (this.fishBase.httpReq.headers.cookie != null) {
            this.fishBase.httpReq.headers.cookie.split(';').forEach((l) => {
                const parts = l.split('=');
                Cookies[parts[0].trim()] = (parts[1] || '').trim();
            });
        }
        return Cookies;
    }
    public getQuery = (name: string) => {
        return this.fishBase.query[name] || false;
    }
    public success = (data: any) => {
        return {
            code: 200,
            data,
            msg: 'ok',
            time: Date.now()
        };
    }
    public fail = (code: number ,msg: string) => {
        return {
            code,
            msg,
            time: Date.now()
        };
    }
}

class Controller {
    protected package: string;
    protected R: R;
    constructor(fish: FishRequest) {
        this.package = '';
        this.R = new R();
        this.R.__setRes__(fish);
    }

}

const fish = {
    Controller
};
export {
    fish
};
