#!/usr/bin/env node
'use strict';
const logUpdate = require('log-update');
//console.log(process.argv);
//console.log(process.env.INIT_CWD);
//console.log(process.env);
//console.log(process);

const Fs = require('fs-extra');

// Arguments
const commander = require('commander');
const program = new commander.Command();

program.storeOptionsAsProperties(false)

program
    .command('condition', 'file/directory condition for deployment, deployment running if file does not exist')
    .command('source', 'directory source')
    .command('destination', 'directory destination')
    .parse(process.argv);

console.log(program.opts());
//


const klawSync = require('klaw-sync');
const root = process.env.INIT_CWD;

const condition = root + '/.gitignore';
const source = '/dist';
const destination = '/';


if(!Fs.pathExistsSync(condition)) {

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

        logUpdate('deployed');
    }

}
