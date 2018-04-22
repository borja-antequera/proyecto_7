const Email=require('../config/emailConf');
var usersModel =require('.././models/usersModel');
var emailController = {};

emailController.recovery=function (req, res, next){

    usersModel.recovery(email,function (err,resultado) {
        if (err){
            res.status(500).json(err);
        }else{
            if(resultado==''){
                req.flash('errorEmail2','El email introducido no está registrado');
                res.redirect('/users/login');
            }
            else{
                let hashEncode=encodeURIComponent(resultado[0].hash);
                let message= {
                    to: req.body.email,
                    subject: 'Email de recuperación de contraseña',
                    html: '<p>Estimad@ '+resultado[0].nombre+':<br>Haga click en el enlace para recuperar su contraseña.</p><br>' +
                    '<a href="http://localhost:3000/mailer/recover/'+hashEncode+'">Recuperar contraseña de Geekshubs travels.</a>'
                }
                Email.transporter.sendMail(message,(error,info) =>{
                    if (error){
                        next()
                    }
                    Email.transporter.close();
                })
                req.flash('correctRecovery','En breves momentos recivira un correo de recuperacion');
                res.redirect('/users/login');
            }
        }

        })
}

emailController.recover=function (req, res, next){
    var hash=decodeURIComponent(req.params.hash);
    console.log(hash);
    usersModel.recover(hash,function (err,resultado) {
        if(resultado==""){
            res.redirect('/');
        }
        else{
            res.render('emailTemplate/recuperar',{
                title:'Pagina de recuperación de contraseña',
                layout:'templates/default',
                id:resultado[0].id,
                name:resultado[0].nombre,
                email:resultado[0].email
            });
        }

    })

}

emailController.sendrecover=function (req, res, next){
    let email=req.body.email;

    usersModel.sendrecover(req.params.id,function(err,resultado){
        if (err){
            res.status(500).json(err);
        }else{
            if(resultado==''){
                req.flash('error','Ha habido un error al mandar el recoverPassword');
                res.redirect('/admins/userpanel');
            }
            else{
                let hashEncode=encodeURIComponent(resultado[0].hash);
                let message= {
                    to: resultado[0].email,
                    subject: 'Email de recuperación de contraseña',
                    html: '<p>Estimad@ '+resultado[0].nombre+':<br>Haga click en el enlace para recuperar su contraseña.</p><br>' +
                    '<a href="http://localhost:3000/mailer/recover/'+hashEncode+'">Recuperar contraseña de Geekshubs travels.</a>'
                }
                Email.transporter.sendMail(message,(err,info) =>{
                    if (err){
                        next()
                    }
                    Email.transporter.close();
                })
                req.flash('correcto','Correo de recuperacion mandado correctamente al usuario '+resultado[0].nombre);
                res.redirect('/admins/userpanel');
            }


        }
    })
}
module.exports = emailController;