import { ListenerConfig } from '../index';
import LogController from './LogController';
import ControllerManage from './ControllerManage';
import * as http from 'http';
import FishParse from './FishParse';
import { ConversionBuffer, getRoute, writeError } from './utils';
import DbBase from './DbBase';
import { SqlConnectConfig } from '../config/DbConfig';
import BodyParser from './BodyParser';

class Listener {
    private CONFIG: ListenerConfig;
    private LOG: LogController;
    private CONTROLLER_MODULE: ControllerManage;
    private DBConnect: DbBase;
    constructor() {
        this.LOG = new LogController('FishJs');
        this.DBConnect = new DbBase(SqlConnectConfig);
    }

    public app = async (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {
            this.LOG.print('Request -> ' + req.method + ' ' + req.url);
            res.setHeader('Content-Type' , 'application/json');
            const bodyData = await BodyParser(req);
            const fishReq = new FishParse(req, res, this.DBConnect, bodyData).parse(); // fish request class
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
        http.createServer(this.app).listen(config.port || 80, config.host || 'localhost', function () {
            console.log(`[Fish.js]: Listening port: ${config.port || 80} host: ${config.host || 'localhost'} http://${config.host || 'localhost'}:${config.port || 80}` );
        });
    }
}

export default Listener;

