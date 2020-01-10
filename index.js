#!/usr/bin/env node
'use strict';
const logUpdate = require('log-update');
console.log(process.argv);
console.log(process.env.INIT_CWD);
console.log(process.env);
//console.log(process);

const klaw = require('klaw');
const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = '/dist';
let dest = '/';

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    //Fs.copySync(source, root, { overwrite: true });

    let promises = [];

    (async ()=> {

        for await (const file of klaw(root + source, {nodir:true})) {

            const log = logUpdate.create(process.stdout);

            const relative = file.path.substr((root + source).length);
            console.log(file.path);
            console.log(root + dest + relative);

            log('aww1');
            const promise = new Promise((resolve, reject) => {

                Fs.move(file.path, root + dest + relative, { overwrite: true });
                setTimeout(()=>{


                    resolve();
                    log('aww2');
                }, 5000);


            }).then(()=>log.clear());

            console.log(file)
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
