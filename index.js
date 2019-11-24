#!/usr/bin/env node
'use strict';


const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = root + '/dist';

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    Fs.copySync(source, root, { overwrite: true });


    for (let i = 0; i <= 5; i++) {

        try {

            Fs.removeSync(source);
            break;

        } catch (e) {

            console.log(`failed retry ${i + 1}`);
        }
    }


    console.log('package installed successfully');

}
