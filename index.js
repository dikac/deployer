#!/usr/bin/env node
'use strict';



const Fs = require('fs-extra');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = root + '/dist';

if(!Fs.pathExistsSync(condition)) {

    console.log('installing package');

    Fs.copySync(source, root, { overwrite: true });
    Fs.removeSync(source);

    console.log('package installed successfully');

}
