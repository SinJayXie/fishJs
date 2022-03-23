interface IndexModelData {
    name: string,
    args: string[]
}

class IndexModel {
    private readonly model: IndexModelData;
    constructor(model: IndexModelData) {
        this.model = {
            name: '',
            args: []
        };
        this._init(model);
    }

    _init(data: object) {
        Object.assign(this.model, data);
    }

    setName(data: string) {
        this.model.name = data;
    }
    setArgs(data: any[]) {
        this.model.args = data;
    }

    getName(data: string) {
        this.model.name = data;
    }
    getArgs(data: any[]) {
        this.model.args = data;
    }

    build() {
        return this.model;
    }

}
export { IndexModel };
