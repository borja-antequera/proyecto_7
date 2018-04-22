var express = require('express');
var hash= require('bcrypt-nodejs');
var router = express.Router();
var destinationsModel =require('.././models/destinationsModel');

/* sequalize */
/*
const Sequelize=require('sequelize');

const sequelize=new Sequelize('travel_agency', 'root','root', {
    host:'localhost',
    dialect:'mysql',
    operatorsAliases:false,
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idle:10000
    }
});

sequelize
    .authenticate()
    .then(()=>{
    console.log('Connection has been established successfully');
    })
    .cath(err =>{
        console.error('Unable to connect to de database:'.err);
    });

const User=sequelize.define('user',{
    nombre:{
        type:Sequelize.String(12)
    },
    email:{
        type:Sequelize.String(45)
    },
    password:{

    },
});

router.get('/iniciar',(req,res,next)=>{
    User.sync({force: false}).then(()=>{
        return User.create({
            firstname:'Jhon',
            lastName:'Jason'
        });
    });
    res.render('Se ha creado la ruta');
});

*/
/* GET home page. */
router.get('/', function(req, res, next) {
    destinationsModel.getDestinations((err,destinos)=>{
        if(err) {
            res.status(500).json(err);
        }else{
            if(!req.session.username){
                res.render('home',{
                    title: 'Home',
                    layout: '../views/templates/default',
                    destinos: destinos
                });
            }else{
                if(req.session.isAdmin){
                    res.render('home',{
                        title: 'Home',
                        layout: '../views/templates/default',
                        destinos: destinos,
                        isLogged: true,
                        isAdmin: true,
                        user: req.session.username
                    });
                }else{
                    res.render('home',{
                        title: 'Home',
                        layout: '../views/templates/default',
                        destinos: destinos,
                        isLogged: true,
                        user: req.session.username
                    });
                }
            }

        }
    })
});





module.exports = router;


