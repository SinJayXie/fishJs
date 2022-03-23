import { IncomingMessage, ServerResponse } from 'http';
import { FishRequest } from '../index';
import * as fs from 'fs';
import * as path from 'path';
const assetsPath = path.join(__dirname, '..');
import MineConfig from '../config/MineConfig';

const getFileExtname = function (path: string) {
    const temp = path.split('.');
    return temp[temp.length - 1] || '';
};

class AssetsService {
    private request: IncomingMessage;
    private response: ServerResponse;
    private fish: FishRequest;
    constructor(req: IncomingMessage, res: ServerResponse, fish: FishRequest) {
        this.request = req;
        this.response = res;
        this.fish = fish;
    }

    public watch = () => {
        if(this.fish.path.indexOf('assets/') === 1) {
            this.response.setHeader('Content-Type', 'text/json');
            const requestFile = path.join(assetsPath, this.fish.path);
            if(fs.existsSync(requestFile)) {
                const stat = fs.statSync(requestFile);
                if(stat.isDirectory()) {
                    this.response.end(JSON.stringify({
                        code: 404,
                        msg: 'Assets File Not Found',
                        time: Date.now()
                    }));
                    return true;
                }
                const headerMine = MineConfig[getFileExtname(requestFile)];
                if(!headerMine) {
                    this.response.end(JSON.stringify({
                        code: 404,
                        msg: 'Assets File Not Found',
                        time: Date.now()
                    }));
                    return true;
                }
                this.response.setHeader('Content-Length', stat.size);
                this.response.setHeader('Content-Type', headerMine);

                const fileStream = fs.createReadStream(requestFile, { highWaterMark: 30 });
                fileStream.on('data', (chunk) => {
                    this.response.write(chunk);
                });

                fileStream.on('error', (err) => {
                    fileStream.close();
                    this.response.end();
                    console.log(err.message);
                });

                fileStream.on('end', () => {
                    fileStream.close();
                    this.response.end();
                });

                this.response.on('close', () => {
                    fileStream.close();
                });
                return true;
            } else {
                this.response.end(JSON.stringify({
                    code: 404,
                    msg: 'Assets File Not Found',
                    time: Date.now()
                }));
                return true;
            }
        }
        // 不是访问静态资源给予放行
        return false;
    }
}

export default AssetsService;
