import { IncomingMessage, ServerResponse } from 'http';
import * as os from 'os';
import * as fs from 'fs';

const tempDir = os.tmpdir() + '/FISH_SESSION.json';

interface SessionConfig {
    expire: number
}

interface SessionData {
    uuid: string,
    expire: number,
    options: any
}

function guid() {
    return 'xxxxxxxx-axxx-bxxx-cxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCookie(cookie:string) {
    const Cookies: any = {};
    if (cookie != null) {
        cookie.split(';').forEach((l) => {
            const parts = l.split('=');
            Cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
    }
    return Cookies;
}

class Session {
    private readonly clientSession: Map<any, any>;
    private config: SessionConfig;
    constructor(SessionConfig: SessionConfig) {
        this.config = SessionConfig;
        this.clientSession = new Map();
        this.load();
    }

    public load = () => {
        try {
            if(fs.existsSync(tempDir)) {
                const jsonBuffer = JSON.parse(fs.readFileSync(tempDir).toString('utf-8'));
                for (const jsonBufferKey in jsonBuffer) {
                    this.clientSession.set(jsonBufferKey, jsonBuffer[jsonBufferKey]);
                }
            }
        } catch (e) {
            console.log('[Fish.js]: Session Error ->' + e.message);
        }
    }

    public create = (req: IncomingMessage,res: ServerResponse) => {
        const cookies = getCookie(req.headers.cookie);
        if(this.clientSession.has(cookies.FISH_session)) {
            const session: SessionData = this.clientSession.get(cookies.FISH_session);
            if(session.expire < Date.now()) {
                const guid_ = guid();
                res.setHeader('Set-Cookie', 'FISH_session=' + guid_);
                const data: SessionData = {
                    uuid: guid_,
                    expire: Date.now() + this.config.expire,
                    options: {}
                };
                this.clientSession.set(guid_, data);
                this.clientSession.delete(cookies.FISH_session);
                this.save();
                return new SessionController(data);
            }
            return new SessionController(session);
        } else {
            const guid_ = guid();
            res.setHeader('Set-Cookie', 'FISH_session=' + guid_);
            const data: SessionData = {
                uuid: guid_,
                expire: Date.now() + this.config.expire,
                options: {}
            };
            this.clientSession.set(guid_, data);
            this.save();
            return new SessionController(data);
        }

    }

    public save = () => {
        const buffer: any = {};
        const sessionKey = this.clientSession.keys();
        let keyName = sessionKey.next();
        while (!keyName.done) {
            buffer[keyName.value] = this.clientSession.get(keyName.value);
            keyName = sessionKey.next();
        }
        fs.writeFileSync(tempDir, JSON.stringify(buffer));
    }

}

class SessionController {
    private session: SessionData;
    constructor(data: SessionData) {
        this.session = data;
    }

    public setSession = (key: string, value: any) => {
        this.session.options[key] = value;
    }

    public getSession = (key: string) => {
        return this.session.options[key] || undefined;
    }

    public removeSession = (key: string) => {
        delete this.session.options[key];
    }
}

export { Session, SessionController };
