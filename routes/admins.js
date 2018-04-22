var express = require('express');
var router = express.Router();
var destinationsController = require('../controllers/destinationController');
var userController= require('../controllers/userController');
const Multer = require('multer');
const upload =  require('../config/multerConf');

router.get('/adminpanel', function(req, res, next) {
    destinationsController.getAllDestinations(req, res, next);
});

router.post('/adminpanel/crear',upload.single('file'), function(req, res, next) {

    destinationsController.createDestination(req, res, next);
});

router.get('/adminpanel/borrar/:id', function (req,res,next) {

    destinationsController.deleteDestination(req, res, next);
})
router.get('/adminpanel/activar/:id', function (req,res,next) {

    destinationsController.activaDestination(req, res, next);
})
router.get('/userpanel',function (req,res,next) {
    userController.getAllUsers(req,res,next);
})

router.get('/userpanel/activo/:id',function (req,res,next) {
    userController.activaUser(req,res,next);
})

router.get('/userpanel/isAdmin/:id',function (req,res,next) {
    userController.darPermisos(req,res,next);
})

router.get('/userpanel/delete/:id',function (req,res,next) {
    //console.log('Entro en ruta');
    userController.deleteUser(req,res,next);
})
router.post('/userpanel/crear', function(req, res, next) {
    userController.createUser(req, res, next);
});

module.exports = router;