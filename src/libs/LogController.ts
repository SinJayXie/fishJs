class LogController {
    private list: any[];
    private readonly name: string;
    constructor(name: string) {
        this.list = [];
        this.name = name;
    }

    public print(data: any): void {
        this.list.push(data);
        console.log(`[${this.name}]: ` + data);
    }
}

export default LogController;
