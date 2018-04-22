var express = require('express');
var router = express.Router();
var emailController=require('../controllers/emailController');
var userController=require('../controllers/userController');

router.post('/recovery', function(req, res, next) {
    emailController.recovery(req, res, next);
});

router.get('/recover/:hash', function(req, res, next) {
    emailController.recover(req, res, next);
});

router.get('/sendactivate/:hash', function(req, res, next) {
    //console.log('llego a la ruta');
    userController.sendactivate(req, res, next);
});

router.get('/sendrecover/:id', function(req, res, next) {
    emailController.sendrecover(req, res, next);
});
module.exports=router;
