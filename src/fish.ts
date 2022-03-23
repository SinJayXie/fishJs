import Listener from './libs/Listener';
import { ListenerConfig } from './index';
import * as path from 'path';

const config: ListenerConfig = {
    port: 80,
    host: '0.0.0.0',
    path: __dirname,
    ssl: {
        key: path.join(__dirname, '../cert/ssl.key'),
        cert: path.join(__dirname, '../cert/ssl.crt')
    }
};

const listener = new Listener();

listener.start(config);
