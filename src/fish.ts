import Listener from './libs/Listener';
import { ListenerConfig } from './index';

const config: ListenerConfig = {
    port: 80,
    host: '0.0.0.0',
    path: __dirname
};

const listener = new Listener();

listener.start(config);
