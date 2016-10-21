/**
 * Created by niyazulla.khan on 21/10/16.
 */

var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next) {
    res.render('error',{title:'someTest'})
});

module.exports=router;
