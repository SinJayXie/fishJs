import { fish } from '../libs/FishBase';
import { FishRequest } from '../index';
import * as fs from 'fs';
import * as path from 'path';

class FileController extends fish.Controller{
    constructor(fish: FishRequest) {
        super(fish);
        this.package = 'file';
    }

    public index = () => {
        return this.R.success('file controller');
    }

    public upload = () => {
        return this.R.render({ title: 'file upload', placeholder: 'please choose a file upload' });
    }

    public clearUpload = async () => {
        const uploadDir = '/Users/sinjayxie/Desktop/fish-js/upload';
        const fileList = fs.readdirSync(uploadDir);
        if(fileList.length > 0) {
            fileList.forEach((name) => {
                fs.unlinkSync(path.join(uploadDir,name));
            });
        }
        return this.R.success(fileList);
    }

    public accept = async () => {
        this.R.setMethod('POST');
        return this.R.success(this.R.body());
    }

}

export default FileController;
