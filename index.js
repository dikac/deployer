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

if(!Fs.pathExistsSync(condition)) {

   // const log = logUpdate.create(process.stdout);
    logUpdate(`deploying : (0/0)`);
    //console.log('installing package');

    //Fs.copySync(source, root, { overwrite: true });

    let promises = [];

    let deployed = 0;
    let files = klawSync(root + source, {nodir: true});
    logUpdate(`deploying : (0/${files.length})`);

    for(let file of files) {

        const relative = file.path.substr((root + source).length);
        const src = file.path;
        const dest = root + destination + relative;


        promises.push(Fs.move(src, dest, { overwrite: true }).then(function () {
            deployed++;
            logUpdate(`deploying : (${deployed}/${files.length})`);
        }).catch(e=>{
            //log.clear();
            console.log(e);
        }));
    }

    //console.log(promises);
    Promise.all(promises);

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
