import { IncomingMessage, ServerResponse } from 'http';
import { FishRequest } from '../index';

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
        if(this.fish.path) {
            return false;
        }
    }
}

export default AssetsService;
