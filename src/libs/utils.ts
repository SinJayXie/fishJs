import { ServerResponse } from 'http';

const ConversionBuffer = function (data: any) {
    let conversionData: any = null;
    switch (typeof data) {
        case 'boolean':
            conversionData = data ? 'true' : 'false';
            break;
        case 'bigint':
            conversionData = String(data);
            break;
        case 'function':
            conversionData = 'function';
            break;
        case 'number':
            conversionData = String(data);
            break;
        case 'object':
            conversionData = JSON.stringify(data);
            break;
        case 'string':
            conversionData = data;
            break;
        case 'symbol':
            conversionData = data;
            break;
        case 'undefined':
            conversionData = '';
            break;
        default:
            conversionData = data;
            break;
    }
    return conversionData;
};

const getRoute = function (path: string) {
    if(path === '/') return false; // default path '/' return false
    const pathSplit = path.split('/'); // split '/' get router
    if(pathSplit.length >= 3) { // length > 3 Such: /index/index return { controller: index, func: index }
        return {
            controller: pathSplit[1],
            func: pathSplit[2]
        };
    }
    return false; // Match failed return false
};

const writeError = function (res: ServerResponse, code: number ,text: string) {
    res.statusCode = code; // set response code
    res.write(JSON.stringify({
        code,
        msg: text,
        time: Date.now()
    }));
    res.end();
};

export {
    ConversionBuffer,
    getRoute,
    writeError
};
