const exec = require('child_process').exec;
const child_process = require('child_process');
const path = require('path');
let devProcess = null;
const tsc = exec('./node_modules/.bin/tsc -w');
tsc.stdout.on('data', (data) => {
    if(data.indexOf('Found 0 errors.') !== -1) {
        console.log('\033[32m ' + data.replace(/\n/gm, '') + ' \033[0m');
        exec('rm -rf ./dist/views');
        exec('rm -rf ./dist/assets');
        copyIt(path.join(__dirname , '../src/views'), path.join(__dirname, '../dist/views'));
        copyIt(path.join(__dirname , '../src/assets'), path.join(__dirname, '../dist/assets'));
        createDevProcess();
        return;
    }
    if(data.indexOf('error. Watching for file changes.') !== -1) {
        if(devProcess !== null) {
            devProcess.kill();
        }
        console.log('\033[31m ' + data.replace(/\n/gm, '') + ' \033[0m');
        return;
    }
    console.log('\033[32m ' + data.replace(/\n/gm, '') + ' \033[0m');
});

tsc.stderr.on('data', function (data) {
    console.log('tsc Error: ' + data.replace(/\n/gm, ''));
    if(devProcess !== null) {
        devProcess.kill();
    }
});

function createDevProcess() {
    if(devProcess !== null) {
        devProcess.kill();
    }
    devProcess = exec('node ./dist/fish');
    console.log('\033[43;37m Starting Fish Js -> node ./dist/fish \033[0m');
    devProcess.stdout.on('data', (data) => {
        console.log(data);
    });
    devProcess.stderr.on('data', function (data) {
        console.log('Error: ' + data);
        if(devProcess !== null) {
            devProcess.kill();
        }
    });
}

function copyIt(from, to) {
    console.log('cp -r ' + from + ' ' + to);
    const copy = child_process.execSync('cp -r ' + from + ' ' + to);
    console.log(copy.toString());
}
