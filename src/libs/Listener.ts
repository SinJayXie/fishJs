import { ListenerConfig } from '../index';
import LogController from './LogController';
import ControllerManage from './ControllerManage';
import * as http from 'http';
import * as https from 'https';
import FishParse from './FishParse';
import { ConversionBuffer, getRoute, writeError } from './utils';
import DbBase from './DbBase';
import { SqlConnectConfig } from '../config/DbConfig';
import BodyParser from './BodyParser';
import AssetsService from './AssetsService';
import * as fs from 'fs';
import { Session, SessionController } from './Session';

class Listener {
    private CONFIG: ListenerConfig;
    private LOG: LogController;
    private CONTROLLER_MODULE: ControllerManage;
    private DBConnect: DbBase;
    private Session: Session;
    constructor() {
        this.LOG = new LogController('FishJs');
        this.DBConnect = new DbBase(SqlConnectConfig);
        this.Session = new Session({ expire: 1 * 60 * 1000 });
    }

    public app = async (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {
            this.LOG.print('Request -> ' + req.method + ' ' + req.url);
            res.setHeader('Server' , 'FishJs/0.1 ');
            const sessionController: SessionController = this.Session.create(req, res);
            const bodyData = await BodyParser(req);
            const fishReq = new FishParse(req, res, this.DBConnect, bodyData, this.CONFIG, sessionController).parse(); // fish request class
            const assetsService: boolean = new AssetsService(req, res, fishReq).watch();
            if(assetsService) return;
            res.setHeader('Content-Type' , 'application/json');
            const route = getRoute(fishReq.path); // match router
            if(route) {
                const func = this.CONTROLLER_MODULE.getController(route.controller, route.func, fishReq);
                if(typeof func !== 'function') {
                    writeError(res, 404, '404 Not found.');
                    return false;
                }
                const responseBuffer = ConversionBuffer(await func());
                if(responseBuffer === '__wait_process__') return;
                res.write(responseBuffer);
                res.end();
            } else {
                writeError(res, 404, 'No route found'); // throw no match router
            }
        } catch (e) {
            writeError(res, 500, e.message);
            console.log(e);
        }
    }

    public start = (config: ListenerConfig) => {
        this.CONFIG = config;
        this.CONTROLLER_MODULE = new ControllerManage(config);
        console.log(` +-+-+-+-+ +-+-+ +-+-+-+-+-+-+-+
 |F|i|s|h| |J|s| |S|t|a|r|t|u|p|
 +-+-+-+-+ +-+-+ +-+-+-+-+-+-+-+`);
        http.createServer(this.app).listen(config.port || 80, config.host || 'localhost', function () {
            console.log(`[Fish.js]: Listening port: ${config.port || 80} host: ${config.host || 'localhost'} http://${config.host || 'localhost'}:${config.port || 80}` );
        });
        if(config.ssl.cert && config.ssl.key) {
            const httpsOption = {
                key : fs.readFileSync(config.ssl.key),
                cert: fs.readFileSync(config.ssl.cert)
            };
            https.createServer(httpsOption, this.app).listen(443, '0.0.0.0', () => {
                console.log('[Fish.js]: Listening port 443 host: 0.0.0.0 https://0.0.0.0');
            });
        }
    }
}

export default Listener;

