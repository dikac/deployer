#!/usr/bin/env node
'use strict';

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


const logUpdate = require('log-update');

console.log(root + condition);

if(!Fs.pathExistsSync(root + condition)) {

    let success = 0;

    logUpdate(`deploying`);

    let error = null;

    let total = null;

    for (let i = 0; i <= 5; i++) {

        error = null;

        let files = klawSync(root + source, {nodir: true});

        if(total === null) {

            total = files;
            logUpdate(`deploying : (0/${total})`);
        }

        for(let file of files) {

            const relative = file.path.substr((root + source).length);
            const src = file.path;
            const dest = root + destination + relative;

            try {

                Fs.moveSync(src, dest, { overwrite: true });
                success++;
                logUpdate(`deploying : (${success}/${total})`);

            } catch (e) {

                error = e;
            }
        }

        if(!error) {

            break ;
        }
    }

    if(error) {

        throw error;

    } else {

        logUpdate(`deploying : cleaning up`);
        Fs.removeSync(root + source);

        logUpdate('deployed');
    }
}
