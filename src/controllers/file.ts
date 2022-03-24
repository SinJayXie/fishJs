import { fish } from '../libs/FishBase';
import { FishRequest } from '../index';

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

    public accept = async () => {
        this.R.setMethod('POST');
        return this.R.success(this.R.body());
    }

}

export default FileController;
