/**
 * Created by niyazulla.khan on 26/10/16.
 */

var express = require('express');
var router = express.Router();
var urlConfig = require('./URL');

router.get('/',function (req,res,next) {
    var url = urlConfig.buListAPI;
    
}
);



module.exports = router;
