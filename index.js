#!/usr/bin/env node
'use strict';

const Fs = require('fs');

const root = process.env.INIT_CWD;

let condition = root + '/.gitignore';
let source = root + '/dist';

console.log(condition, source, root);

if(!Fs.existsSync(condition)) {

    console.log('installing package');

    Fs.mv(source, root, {mkdirp: true}, function(err) {

        if(err) {

            console.log(err);
            throw new Error('error when installing package');

        } else {

            console.log('package installed successfully');
        }

    });
}
