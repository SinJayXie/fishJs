import { fish } from '../libs/FishBase';
import { FishRequest } from '../index';
import axios from 'axios';
import { IndexModel } from './model/index.model';
import * as fs from 'fs';
import { exec } from 'child_process';

function base64_decode(base64str: string, file: string) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    const bitmap = Buffer.from(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
}

class Index extends fish.Controller{
    constructor(fish: FishRequest) {
        super(fish);
        this.package = 'index';
    }

    public save = async () => {
        this.R.setMethod('POST');
        const body = this.R.body();
        console.log(body.files);
        // base64_decode(body.image,'/Users/sinjayxie/desktop/image/' + Date.now() + '.png');
        exec('open /Users/sinjayxie/Desktop/fish-js/upload/');
        return this.R.success('ok');
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

    public goodOrBad = async () => {
        const params = {
            p: this.R.getQuery('p'),
            city: this.R.getQuery('city'),
            car: this.R.getQuery('car')
        };
        if(!(params.p && params.car && params.city)) return this.R.fail(403, '缺少参数');
        const data = await axios({
            method: 'GET',
            url: 'https://www.jihaoba.com/chepai/jixiong',
            params
        });
        const mainData = data.data.match(/<div class="gujia_jg">([\w\W]*?)<div class="gujia_tj">/gm);
        if(mainData.length > 0) {
            const text = mainData[0];
            const gbTest = /吉凶预测：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;
            const numberTest = /车牌号：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;
            const yeLangTest = /吉凶谒语：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;
            const masterCharacterTest = /主人性格：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;
            const workTest = /适合工作：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;
            const specificTest = /具体表现：<\/span><span class="gujia_r fr">(.*?)<\/span>/gm;

            const data: any = {
                number: numberTest.exec(text)[1],
                goodOrBad: gbTest.exec(text)[1],
                yeLang: yeLangTest.exec(text)[1],
                masterCharacter: masterCharacterTest.exec(text)[1],
                work: workTest.exec(text)[1],
                specific: specificTest.exec(text)[1]
            };

            return this.R.success(data);
        }

        return this.R.fail(500, '服务器出错');
    }

}

export default Index;
