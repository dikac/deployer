#!/usr/bin/env node
'use strict';

const Fs = require('fs-extra');

// Arguments
const commander = require('commander');
const program = new commander.Command();

program.storeOptionsAsProperties(false);

program.arguments('<condition> <source> <destination> [remove]').description('deployer', {
    condition : 'file/directory condition for deployment, deployment running if file does not exist',
    source : 'directory source',
    destination : 'directory destination',
    remove : 'directory to be removed'

}).parse(process.argv);

program.args = program.args.map(argument=>{

    if(['/','\\'].includes(argument)) {

        return '';
    }

    return argument;
});

const [condition, source, destination, remove] = program.args;


const klawSync = require('klaw-sync');
const root = process.env.INIT_CWD;

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

    let error = null;

    if(Fs.pathExistsSync(root + source)) {

        let success = 0;

        logUpdate(`deploying`);

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
    }

    if(error) {

        throw new Error(error);

    } else {


        if(Fs.pathExistsSync(root + source)) {

            logUpdate(`cleaning up`);
            Fs.removeSync(root + source);

            if(remove) {
                Fs.removeSync(root + remove);
            }
        }

        logUpdate('deployed');
    }

} else {

    logUpdate('development')
}
