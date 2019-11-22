#!/usr/bin/env node
'use strict';


console.log('1111111111111111111111111111');

const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = root + '/dist';
console.log('22222222222222222222222222222222222');
console.log(condition, source, root);

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    Fs.moveSync(source, root, { overwrite: true });

    console.log('package installed successfully');

    // {mkdirp: true}, function(err) {
    //
    //     if(err) {
    //
    //         console.log(err);
    //         throw new Error('error when installing package');
    //
    //     } else {
    //
    //         console.log('package installed successfully');
    //     }
    //
    // });
}
console.log('33333333333333333333333333333333');