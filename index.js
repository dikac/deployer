#!/usr/bin/env node
'use strict';
const logUpdate = require('log-update');
//console.log(process.argv);
//console.log(process.env.INIT_CWD);
//console.log(process.env);
//console.log(process);

const klaw = require('klaw');
const Fs = require('fs-extra');
const klawSync = require('klaw-sync')
const root = process.env.INIT_CWD;

const condition = root + '/.gitignore';
const source = '/dist';
const destination = '/';

class Success  {

    _success = 0;
    total = 0;

    constructor(total) {

        this.total = total;

    }

    success() {
        this._success++;
        logUpdate(`deploying : (${this._success}/${this.total})`);
    }

    remain() {

        return this.total - this._success;
    }

};


function Move(source, destination, success) {

    let promises = [];



    return promises;
}

function Loop(source, destination, success, retry) {

    Promise.all(Move(source, destination, success)).then(()=>{


    }).catch((e)=>{

        if(retry === 0) {

            throw e;

        } else {

            return Loop(source, destination, success, --retry);
        }
    });
}

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

    }

    if(error) {

        throw error;

    } else {

        logUpdate('deployed');
    }

    //console.log(promises);


    //console.log(files);

    // (async ()=> {
    //
    //     for await (const file of klaw(root + source, {nodir:true})) {
    //
    //         const log = logUpdate.create(process.stdout);
    //
    //         const relative = file.path.substr((root + source).length);
    //         const src = file.path;
    //         const dest = root + destination + relative;
    //
    //         //console.log(src);
    //         //console.log(dest);
    //
    //         log(`installing:${src}`);
    //
    //         promises.push(Fs.move(src, dest, { overwrite: true }).then(function () {
    //
    //             log.clear();
    //
    //         }).catch(e=>{
    //             log.clear();
    //             console.log(e);
    //         }));
    //
    //        // console.log(file)
    //     }
    // })().then(()=>{
    //
    //     console.log(promises);
    //     Promise.all(promises);
    // });


   // for (let i = 0; i <= 5; i++) {

        // try {
        //
        //     Fs.removeSync(source);
        //   //  break;
        //
        // } catch (e) {
        //
        //     console.log(`failed retry ${i + 1}`);
        // }
  //  }


    //console.log(klaw(root + source, {nodir:true}));
   // console.log('package installed successfully');

}
