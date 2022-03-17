import { IncomingMessage } from 'http';
import * as multiparty from 'multiparty';
import * as url from 'url';
const BodyParser = function (request: IncomingMessage) {
    return new Promise((resolve, reject) => {
        const contentType: string = request.headers['content-type'] || '';
        const chunkData: any[] = [];
        if(contentType.indexOf('multipart/form-data') !== -1) {
            formData(request, resolve, reject);
            return;
        }
        request.on('data', (chunk) => {
            chunkData.push(chunk);
        });
        request.on('end', () => {
            const postBody = Buffer.concat(chunkData);
            if(chunkData.length === 0) {
                resolve({});
                return;
            }
            if(contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
                resolve(formUrlencoded(postBody));
            } else if(contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
                resolve(formUrlencoded(postBody));
            } else if(['text/plain','application/xml','application/javascript','text/html'].includes(contentType)) {
                resolve(postBody.toString('utf-8'));
            } else if(contentType.indexOf('application/octet-stream') !== -1) {
                resolve(octetStream(postBody));
            } else if(contentType.indexOf('application/json') !== -1) {
                resolve(json(postBody));
            }
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};

function formData(req: IncomingMessage, resolve: any, reject: any) {
    const form = new multiparty.Form({
        maxFieldsSize: 5 * 1024 * 1024,
        maxFields: 1000,
        uploadDir: '/Users/sinjayxie/Desktop/fish-js/upload'
    });
    form.parse(req, (error, fields, files) => {
        if (error) {
            reject(error);
        } else {
            resolve({ fields,files });
        }
    });
}
function formUrlencoded(buffer: Buffer) {
    const query = buffer.toString('utf-8');
    return Object.freeze(url.parse('?' + query, true).query);
}

function octetStream(buffer: Buffer) {
    return buffer;
}

function json(buffer: Buffer) {
    const jsonStr = buffer.toString('utf-8');
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.log(`[JSON Parse]: "${e.message}"\nError body: '${jsonStr}'\n`);
        return jsonStr;
    }
}

export default BodyParser;
