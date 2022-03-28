import { fish } from '../libs/FishBase';
import { FishRequest } from '../index';
import axios from 'axios';
import { IndexModel } from './model/index.model';

class Index extends fish.Controller{
    constructor(fish: FishRequest) {
        super(fish);
        this.package = 'index';
    }
    public index = async () => {
        const Model = new IndexModel({
            name: 'test',
            args: ['a','b']
        });
        this.R.session.setSession('test', Date.now());
        return this.R.success(Model.build());
    }

    public session = async () => {
        return this.R.success(this.R.session.getSession('test'));
    }

    public post = async () => {
        this.R.setMethod('POST');
        return this.R.success({ body: this.R.body() });
    }

    public checkMethod = async () => {
        this.R.setMethod('GET');
        return this.R.success('GET');
    }

    public download = async () => {
        const downPath = '/Users/sinjayxie/Downloads/infinity-2593181.jpg';
        return this.R.sendFile(downPath, 'test_file.jpg', { highWaterMark: 30 });
    }

    public render = async () => {
        return this.R.render({ body: new Date() });
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
