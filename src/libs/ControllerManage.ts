import * as path from 'path';
import * as fs from 'fs';
import { FishRequest, ListenerConfig } from '../index';
class ControllerManage {
    private readonly CONTROLLER_PATH: string;
    private MODULE_MAP: Map<any, any>;
    private MODULE_LIST: string[];
    constructor(config: ListenerConfig) {
        this.CONTROLLER_PATH = path.join(config.path, 'controllers');
        this.MODULE_LIST = [];
        this.MODULE_MAP = new Map();
        this.find();
    }

    public find = () => {
        if(fs.existsSync(this.CONTROLLER_PATH)) {
            const stat: fs.Stats = fs.statSync(this.CONTROLLER_PATH);
            if(stat.isDirectory()) {
                this.MODULE_LIST = fs.readdirSync(this.CONTROLLER_PATH);
                this.loadModule();
            } else {
                throw new Error(`[Error]: Controller '${this.CONTROLLER_PATH}' directory is not exists`);
            }
        } else {
            throw new Error(`[Error]: Controller '${this.CONTROLLER_PATH}' directory is not exists`);
        }
    }

    public loadModule = () => {
        this.MODULE_LIST.forEach((fileName) => {
            const date = Date.now();
            const modulePath = path.join(this.CONTROLLER_PATH, fileName);
            if(modulePath.substr(modulePath.length - 3) === '.js') {
                try {
                    // eslint-disable-next-line global-require
                    const moduleCache = require(modulePath);
                    const moduleFunction = new moduleCache.default();
                    if(moduleFunction.package) {
                        this.MODULE_MAP.set(moduleFunction.package, moduleCache.default);
                        console.log(`[Import Module]: ${modulePath} -> ${(Date.now() - date)} ms`);
                    }
                } catch (e) {
                    console.log(e);
                    throw new Error(`[Error]: Can't load module '${modulePath}'...`);
                }
            }
        });
    }

    public getController: Function = (name: string, func: string, fishReq: FishRequest) => {
        try {
            const moduleFind = this.MODULE_MAP.get(name);
            if(moduleFind) {
                const createModule = new moduleFind(fishReq);
                if(typeof createModule[func] === 'function') {
                    return createModule[func];
                }
                Error(`Function '${func}' not find.`);
            }
            Error(`Controller '${name}' not find.`);
        } catch (e) {
            throw e;
        }
    }
}

export default ControllerManage;
