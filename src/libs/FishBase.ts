import { FishRequest } from '../index';
import * as fs from 'fs';
import { CreateReadStreamOptions } from 'fs/promises';
import { Data } from 'ejs';
import { SessionController } from './Session';

class R {
    private data: {};
    public fishBase: FishRequest;
    public session: SessionController;
    constructor() {
        this.data = {};
    }
    public __setRes__ = (res: FishRequest) => {
        if(res) {
            this.fishBase = res;
            this.session = res.session;
        }
    }

    /**
     * Render ejs template html
     * @param data
     */
    public render = async (data: Data) => {
        this.setHeader('Content-Type', 'text/html; charset=utf-8');
        return await this.fishBase.templateEngine.render(data, this.fishBase.httpRes);
    }

    /**
     * wait process
     */
    public wait = () => {
        return '__wait_process__';
    }

    /**
     * Get request body
     */
    public body = () => {
        return this.fishBase.body;
    }

    /**
     * Set Http method GET,POST,PUT,DELETE...more
     * @param method
     */
    public setMethod = (method: string) => {
        if(this.fishBase.method.toUpperCase() !== method.toUpperCase()) {
            throw Error(`Not arrow method '${this.fishBase.method}'`);
        }
    }

    /**
     * Send file to client
     * @param downPath
     * @param fileName
     * @param readOption
     */
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

    /**
     * Socket stream write
     * @param chunk
     */
    public write = (chunk: any) => {
        this.fishBase.httpRes.write(chunk);
    }

    /**
     * Socket stream disconnect
     */
    public end = () => {
        this.fishBase.httpRes.end();
    }

    /**
     * Set response headers
     * @param key
     * @param value
     */
    public setHeader = (key: string, value: string) => {
        this.fishBase.httpRes.setHeader(key, value);
    }

    /**
     * Set http status code
     * @param code
     */
    public setStatusCode = (code: number) => {
        this.fishBase.httpRes.statusCode = code;
    }

    /**
     * Set client cookies
     * @param name
     * @param value
     */
    public setCookie = (name: string, value: string) => {
        this.setHeader('Set-Cookie', `${name}=${value}`);
    }

    /**
     * Get request header
     */
    public getHeader = () => {
        return this.fishBase.httpReq.headers;
    }

    /**
     * Get request cookies
     */
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

    /**
     * Get url query params
     * @param name
     */
    public getQuery = (name: string) => {
        return this.fishBase.query[name] || false;
    }

    /**
     * Returns success data
     * @param data
     */
    public success = (data: any) => {
        return {
            code: 200,
            data,
            msg: 'ok',
            success: true,
            time: Date.now()
        };
    }

    /**
     * Returns fail data
     * @param code
     * @param msg
     */
    public fail = (code: number ,msg: string) => {
        this.setStatusCode(code);
        return {
            code,
            msg,
            success: false,
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
