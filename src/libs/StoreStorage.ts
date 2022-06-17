class StoreStorage {
    private _storeMap: Map<any, any>;
    constructor() {
        this._storeMap = new Map();
    }

    public setStore = (name: string, state: object) => {
        this._storeMap.set(name, new Content(state, name));
    }

    public getStore = (name: string) => {
        const content: Content = this._storeMap.get(name);
        return content;
    }
}

class Content {
    private data: { name: string; content: object, createTime: number };
    constructor(state: object, name: string) {
        this.data = {
            name,
            content: state,
            createTime: Date.now()
        };
    }

    public get = () => {

    }

    public date = () => {
        return this.data.createTime;
    }
}

export default StoreStorage;
