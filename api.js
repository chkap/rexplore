const express = require('express');
const path = require('path')

const myfs = require('./fs');

router = express.Router();

router.get('/dir', function(req, res, next){
    const relPath = req.query.path;
    console.debug(`path: ${relPath}`);
    if(!relPath || typeof relPath !== 'string'){
        res.sendStatus(400);
    }
    const expandPath = path.resolve(path.join(res.app.get('ROOT'), relPath));
    if(!expandPath.startsWith(res.app.get('ROOT'))){
        res.sendStatus(403);
    }else{
        return new Promise((resolve) =>{
            myfs.getDirContent(expandPath).then(info=>{
                const [err, content] = info;
                if (err){
                    res.status(404).send('Invalid path');
                    resolve();
                }else{
                    res.json(content);
                    resolve();
                }
            })
        });
    }
});

module.exports = router;

