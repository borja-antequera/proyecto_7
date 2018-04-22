var bcrypt = require('bcrypt-nodejs');
var usersModel =require('.././models/usersModel');
const Email=require('../config/emailConf');
const paginate= require('express-paginate');


var userController = {};


userController.signUp = function (req, res, next) {
    if(req.session.username){
        res.redirect('/');
    }else{
        res.render('users/signup', {
            title: 'registro',
            layout: 'templates/default',
            errorUsuario: req.flash('errorUsuario'),
            errorEmail: req.flash('errorEmail'),
            chancePass:req.flash('chancePass')
        });
    }

}

userController.postSignUp = function (req, res, next){


    var hash = bcrypt.hashSync(req.body.password);

    var usuario = {
        nombre : req.body.nombre,
        email : req.body.email,
        password : req.body.password,
        hash : hash,
        isAdmin: 0
    };

    usersModel.signUp(usuario,function (err,resultado) {
        if (err){
            res.status(500).json(err);
        }else{
            //
            switch (resultado){
                case 1:
                    req.flash('errorUsuario','El usuario ya existe, inténtelo de nuevo')
                    res.redirect('/users/signup');
                    break;
                case 2:
                    req.flash('errorEmail','El email ya existe, inténtelo de nuevo')
                    res.redirect('/users/signup');
                    break;
                case 3:
                    let hash2=usuario.hash;
                    let hashEncode=encodeURIComponent(hash2);
                    let message= {
                        to: usuario.email,
                        subject: 'Email de activacion de usuario',
                        html: '<p>Estimad@ '+usuario.nombre+':<br>Haga click en el enlace para activar tu usuario.</p><br>' +
                        '<a href="http://localhost:3000/mailer/sendactivate/'+hashEncode+'">Activar usuario de Geekshubs travels.</a>'
                    }
                    Email.transporter.sendMail(message,(err,info) =>{
                        if (err){
                            next()
                        }
                        Email.transporter.close();
                    })
                    req.flash('registroOk','Se ha registrado correctamente, en breve recibira un correo para activar su cuenta')
                    res.redirect('/users/login');
                    break;
            }
        }
    })
};

userController.signIn = function (req, res, next) {

    if(req.session.username){
        res.redirect('/');
    }else{
        res.render('users/signin', {
            title: 'login',
            layout: 'templates/default',
            registroOk: req.flash('registroOk'),
            errorEmail: req.flash('errorEmail'),
            errorPassword: req.flash('errorPassword'),
            errorEmail2: req.flash('errorEmail2'),
            correctRecovery:req.flash('correctRecovery'),
            errorMailReg:req.flash('errorMailReg')
        });
    }
};

userController.postSignIn = function (req, res , next) {
    var usuario = {
        email: req.body.email,
        password: req.body.password
    }
    usersModel.login(usuario, function (err, resultado, usuarioRegistrado) {
        if (err) {
            res.status(500).json(err);
        } else {
            switch (resultado) {
                case 1:
                    req.flash('errorEmail', 'El email no existe')
                    res.redirect('/users/login');
                    break;
                case 2:
                    req.flash('errorPassword', 'El password es incorrecto')
                    res.redirect('/users/login');
                    break;
                case 3:
                    req.session.username = usuarioRegistrado.nombre;
                    req.session.isAdmin = usuarioRegistrado.isAdmin;
                    res.redirect('/');
                    break;
                case 4:
                    req.flash('errorPassword', 'Usuario no activo, revisa tu correo y activa tu cuenta')
                    res.redirect('/users/login');
                    break;
            }

        }
    });
};

userController.logOut= function (req, res, next){


    if(!req.session.username){
        res.redirect('/');
    }else{
        req.session.destroy();
        res.redirect('/');
    }
};

userController.getAllUsers= function (req, res, next) {
    let page=(parseInt(req.query.page) || 1) -1;
    let limit = 2;
    let offset = page * limit ;
    usersModel.paginate(offset,limit,(err, usuarios) => {
        if (err) {
            res.status(500).json(err);
        }
        else {
            if (!req.session.username) {
                res.redirect('/');
            } else {
                if (req.session.isAdmin) {
                    const currentPage = offset ===0 ? 1:(offset/limit)+1;
                    const totalCount = usuarios.count[0].total;
                    const pageCount = Math.ceil(totalCount /limit);
                    const pagination = paginate.getArrayPages(req)(10,pageCount, currentPage);
                    res.render('userPanel', {
                        title: 'Panel de administrador',
                        layout: '../views/templates/default',
                        correcto: req.flash('correcto'),
                        error: req.flash('error'),
                        isLogged: true,
                        isAdmin: true,
                        user: req.session.username,
                        usuarios: usuarios.rows,
                        currentPage,
                        links: pagination,
                        hasNext: paginate.hasNextPages(pageCount),
                        pageCount

                    })
                } else {
                    res.redirect('/');
                }
            }
        }
    })
};





userController.activaUser = (req, res, next) => {
    usersModel.activaUser(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            if (!req.session.username) {
                res.redirect('/');
            } else {
                if (req.session.isAdmin) {
                    req.flash('error', 'Se ha cambiado el campo activo del usuario ' + req.params.id + '!')
                    res.redirect('/admins/userpanel');
                } else {
                    res.redirect('/');
                }
            }
        }
    })
}
userController.darPermisos = (req, res, next) => {
    usersModel.darPermisos(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            if (req.session.isAdmin) {
                req.flash('error', 'Se ha cambiado el campo activo del usuario ' + req.params.id + '!')
                res.redirect('/admins/userpanel');
            } else {
                res.redirect('/');
            }
        }
    })
}


userController.createUser = (req, res, next)=>{

    var hash2 = bcrypt.hashSync(req.body.password);

    var usuario={
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        hash:hash2,
        isAdmin:0,
        active:0
    }

    usersModel.createUser(usuario,(err,result)=>{
        if(err) {
            res.status(500).json(err);
        }else{
                if(req.session.isAdmin){
                    req.flash('correcto','Se ha creado el ususario correctamente!')
                    res.redirect('/admins/userpanel');
                }else{
                    res.redirect('/');
                }
        }
    })
};


userController.deleteUser=(req,res,next)=>{
    //console.log('Entro en el controlador');
    usersModel.deleteUser(req.params.id,(err,result)=>{
        if (err) {
            res.status(500).json(err);
        } else {
            if (req.session.isAdmin) {
                req.flash('error', 'Se ha borrado el usuario ' + req.params.id + '!')
                res.redirect('/admins/userpanel');
            } else {
                res.redirect('/');
            }
        }
    })
}

userController.recoverPass=(req,res,next)=>{

    var hash3 = bcrypt.hashSync(req.body.newPassword);

    let usuario= {
        id: req.body.id,
        password: req.body.newPassword,
        hash: hash3,
    }
    usersModel.recoverPass(usuario,(err,result)=>{
        if (err){
            res.status(500).json(err);
        }else {
            req.flash('chancePass', 'Cambio de contraseña realizado correctamente, Inicia sesion');
            res.redirect('/users/login');
            /*
            var chancePass = "Cambio de contraseña realizado correctamente, Inicia sesion";
            res.render('users/signin', {
                title: 'cambio password',
                layout: 'templates/default',
                chancePass: req.flash('chancePass')
            })
            */
        }
    })
}

userController.sendactivate=(req,res,next)=>{
    //console.log(req.params.hash);
    var hash=decodeURIComponent(req.params.hash);
    usersModel.sendactivate(hash,function (err,result) {
        if (err){
            res.status(500).json(err);
        }else {
            if (result == "") {
                req.flash('errorMailReg', 'Fallo al activar tu cuenta, vuelve a intentarlo mas tarde');
                res.redirect('/users/login');
            }
            else {
                req.flash('registroOk', 'Usuario activo, ya puedes iniciar sesión');
                res.redirect('/users/login');
            }
        }
    })
}
module.exports = userController;


