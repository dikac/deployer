#!/usr/bin/env node
'use strict';
const logUpdate = require('log-update');
//console.log(process.argv);
//console.log(process.env.INIT_CWD);
//console.log(process.env);
//console.log(process);

const klaw = require('klaw');
const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

const condition = root + '/.gitignore';
const source = '/dist';
const destination = '/';

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    //Fs.copySync(source, root, { overwrite: true });

    let promises = [];

    (async ()=> {

        for await (const file of klaw(root + source, {nodir:true})) {

            const log = logUpdate.create(process.stdout);

            const relative = file.path.substr((root + source).length);
            const src = file.path;
            const dest = root + destination + relative;

            //console.log(src);
            //console.log(dest);

            log(`installing:${src}`);

            promises.push(Fs.move(src, dest, { overwrite: true }).then(function () {

                log.clear();

            }).catch(e=>{
                log.clear();
                console.log(e);
            }));

           // console.log(file)
        }
    })();

    Promise.all(promises);

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


    console.log('package installed successfully');

}
