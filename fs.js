const fs = require('fs').promises;
const path = require('path');
const { get } = require('http');

async function getDirContent(dir){
    let fdir;
    try{
        fdir = await fs.opendir(dir);
    } catch (err){
        return [err, null];
    }

    const dirs = [];
    const files = [];
    for await (const f of fdir){
        if( f.isDirectory()){
            dirs.push(f.name);
        }else if(f.isFile()){
            files.push(f.name)
        }
    }
    return [null, [dirs, files]];
}

module.exports = {
    getDirContent
};


function test(){
    const dir = 'fs.js';
    getDirContent(dir).then( info =>{
        const [err, content] = info;
        if(err){
            console.log(err.message)
            return;
        }
        const [dirs, files] = content;
        console.log('Dirs:');
        for( const dir of dirs){
            console.log(dir);
        }
        console.log('Files');
        for( const file of files){
            console.log(file);
        }

    });
}
