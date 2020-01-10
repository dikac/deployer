#!/usr/bin/env node
'use strict';

console.log(process.argv);
console.log(process.env.INIT_CWD);
console.log(process.env);
//console.log(process);

const Klaw = require('klaw')
const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = root + '/dist';

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    Fs.copySync(source, root, { overwrite: true });


    for (const file of Klaw('/some/dir')) {
        console.log(file)
    }

   // for (let i = 0; i <= 5; i++) {

        try {

            Fs.removeSync(source);
          //  break;

        } catch (e) {

            console.log(`failed retry ${i + 1}`);
        }
  //  }


    console.log('package installed successfully');

}
