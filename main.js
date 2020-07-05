#!/usr/bin/env node
const express = require('express');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

const argv = yargs.option('p', {
            'alias': 'port',
            'default': 18080,
            'type': 'number',
        })
        .usage('Usage: $0 [options] root')
        .demandCommand(1)
        .help()
        .argv;
const root = path.resolve(argv._[0]);
console.log(`Serve files in directory: ${root}`);

// ensure root is available
try {
    const rootDir = fs.opendirSync(root);
    rootDir.closeSync();
} catch (err) {
    console.error(`Error, destination not exists: ${root}`);
    throw err;
}

const app = require('./app.js');
app.set('ROOT', root)
app.use('/files', express.static(root));
app.listen(argv.port);

