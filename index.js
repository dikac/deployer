#!/usr/bin/env node
'use strict';

console.log('process.env.INIT_CWD================================');
console.log(process.env.INIT_CWD);
const Fs = require('fs-extra');

// Arguments
const commander = require('commander');
const program = new commander.Command();

program.storeOptionsAsProperties(false);

program
    .command('condition', 'file/directory condition for deployment, deployment running if file does not exist')
    .command('source', 'directory source')
    .command('destination', 'directory destination')
    .parse(process.argv);


program.args = program.args.map(argument=>{

    if(['/','\\'].includes(argument)) {

        return '';
    }

    return argument;
});

const [condition, source, destination] = program.args;


const klawSync = require('klaw-sync');
const root = process.env.INIT_CWD;
console.log('process.env.INIT_CWD================================');
console.log(root);


const logUpdate = require('log-update');

// Write output but don't hide the cursor
const log = logUpdate.create(process.stdout, {
    showCursor: true
});

function write(success, total, error, retry) {

    let message = [];

    if(retry > 0) {

        message.push(`retry : ${retry}`);
    }

    message.push(`deploying : ${success}/${total}`);

    if(error > 0) {

        message.push(`error : ${error}`);
    }

    logUpdate(message.join("\n"));
}

if(!Fs.pathExistsSync(root + condition)) {

    let success = 0;

    logUpdate(`deploying`);

    let error = null;
    let errorNumber = 0;

    let total = null;

    for (let i = 0; i <= 5; i++) {

        error = null;

        let files = klawSync(root + source, {nodir: true});

        if(total === null) {

            total = files.length;
            write(success, total, errorNumber, i);
        }

        for(let file of files) {

            const relative = file.path.substr((root + source).length);
            const src = file.path;
            const dest = root + destination + relative;

            try {

                Fs.moveSync(src, dest, { overwrite: true });
                success++;
                write(success, total, errorNumber, i);

            } catch (e) {

                errorNumber++;
                error = e;
            }
        }

        if(!error) {

            break ;
        }
    }

    if(error) {

        throw new Error(error);

    } else {

        logUpdate(`cleaning up`);
        Fs.removeSync(root + source);

        logUpdate('deployed');
    }

} else {

    logUpdate('development')
}
