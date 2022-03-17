import { fish } from '../libs/FishBase';
import { FishRequest } from '../index';
import axios from 'axios';

class Index extends fish.Controller{
    constructor(fish: FishRequest) {
        super(fish);
        this.package = 'index';
    }
    public index = async () => {
        const result = await this.R.fishBase.sql.query('show tables', []);
        return this.R.success(result);
    }

    public post = async () => {
        this.R.setMethod('POST');
        console.log(this.R.body());
        return this.R.success({ body: this.R.body() });
    }

    public checkMethod = async () => {
        this.R.setMethod('GET');
        return this.R.success('GET');
    }

    public download = async () => {
        const downPath = '/Users/sinjayxie/Downloads/AltServer.zip';
        return this.R.sendFile(downPath, 'test_file.zip', { highWaterMark: 10 });
    }

    public proxy = async () => {
        const url = this.R.getQuery('url');
        if(url) {
            this.R.setHeader('Content-Type', 'text/html');
            const result = await axios.get(url + '');
            return result.data;
        } else {
            return this.R.fail(403, '缺少参数');
        }
    }
}

export default Index;
