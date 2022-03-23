import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { ServerResponse } from 'http';

class TemplateBase {
    private readonly _path: string;
    private readonly errorTemplate: string;
    constructor(path_: string, route_: string) {
        this._path = path.join(path_, 'views', route_ + '.ejs');
        try {
            this.errorTemplate = fs.readFileSync(path.join(__dirname, '../views/ErrorTemplate.ejs')).toString('utf-8');
        } catch (e) {
            this.errorTemplate = '';
        }

    }

    public render = async (data: ejs.Data, res: ServerResponse) => {
        try {
            if(fs.existsSync(this._path)) {
                const templateBuffer = fs.readFileSync(this._path);
                return await ejs.render(templateBuffer.toString('utf-8'), data, { async: true });
            } else {
                Error('Template not found');
            }
        } catch (e) {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 500;
            res.write(await renderHtml(this._path + '\n' + e.message, this.errorTemplate));
            res.end();
            return '__wait_process__';
        }

    }
}

async function renderHtml(errText: string, template: string) {
    const errRow: string[] = errText.split('\n');
    const configData: any = {
        errorFile: '',
        lines: [],
        errorTips:''
    };
    configData.errorTips = errRow[errRow.length - 1];
    errRow.forEach((row, index) => {
        if(index === 0) {
            configData.errorFile = row;
        } else {
            // if(row.indexOf())
            if(/^(.*?)[1-9]\d*\|/.exec(row)) {
                const line = row.split('| ');
                configData.lines.push(makeLine(line, configData));
            }
        }
    });
    if(template) {
        try {
            return await ejs.render(template, configData, { async: true });
        } catch (e) {
            console.log(e);
            return errText;
        }
    }
    return errText;
}

function makeLine(line: string[], configData: any) {
    const lineNumber = line[0].replace(/\s+/gm, '');
    line.splice(0,1);
    function formatHTML(str: string) {
        return str.replace(/</gm,'&lt;').replace(/>/gm,'&gt;');
    }
    if(lineNumber.indexOf('>>') !== -1) {
        // Error Line
        return `<div class="rows error"><div class="line">${lineNumber.replace('>>','')}</div><div><pre>${formatHTML(line.join(''))}<div class="error-tips">Error: ${configData.errorTips}</div></pre></div></div>`;
    }
    return `<div class="rows"><div class="line">${lineNumber.replace('>>','')}</div><div><pre>${formatHTML(line.join(''))}</pre></div></div>`;
}
export default TemplateBase;
