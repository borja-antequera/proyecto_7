var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/signup', (req, res, next)=>{
    userController.signUp(req,res,next);
});

router.post('/signup',(req,res,next)=>{
    userController.postSignUp(req, res, next);

});

router.get('/login', (req, res, next)=>{
    userController.signIn(req, res, next);
});

router.post('/login', (req, res, next)=>{
    userController.postSignIn(req, res, next);
});
router.get('/logout', (req, res, next)=>{
    userController.logOut(req,res,next);
});

router.post('/recoverPass', (req, res, next)=>{
    userController.recoverPass(req,res,next);
});


module.exports = router;
