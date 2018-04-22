var destinationsModel = require('../models/destinationsModel');
var destinationsController = {};
const paginate = require('express-paginate');


destinationsController.getAllDestinations= (req, res, next)=> {
    //console.log("Estoy entrando");
    let page=(parseInt(req.query.page) || 1) -1;
    let limit = 2;
    let offset = page * limit ;
    destinationsModel.paginate(offset, limit,(err,destinos)=>{
        if(err) {
            res.status(500).json(err);
        }else{
            if(!req.session.username){
                res.redirect('/');
            }else{
                if(req.session.isAdmin){
                    const currentPage = offset ===0 ? 1:(offset/limit)+1;
                    const totalCount = destinos.count[0].total;
                    const pageCount = Math.ceil(totalCount /limit);
                    const pagination = paginate.getArrayPages(req)(10,pageCount, currentPage);
                    res.render('adminPanel',{
                        title: 'Panel de administrador',
                        layout: '../views/templates/default',
                        correcto: req.flash('correcto'),
                        error: req.flash('error'),
                        isLogged: true,
                        isAdmin: true,
                        user: req.session.username,
                        destinos: destinos.rows,
                        currentPage,
                        links: pagination,
                        hasNext: paginate.hasNextPages(pageCount),
                        pageCount

                    })
                }else{
                    res.redirect('/');
                }
            }
        }
    })
};




destinationsController.getDestinations= (req, res, next)=> {
   // console.log("Estoy entrando");
    destinationsModel.getDestinations((err,destinos)=>{
        if(err) {
            res.status(500).json(err);
        }else{
            if(!req.session.username){
                res.redirect('/');
            }else{
                if(req.session.isAdmin){
                    res.render('adminPanel',{
                        title: 'Panel de administrador',
                        layout: '../views/templates/default',
                        destinos: destinos,
                        correcto: req.flash('correcto'),
                        error: req.flash('error'),
                        isLogged: true,
                        isAdmin: true,
                        user: req.session.username
                    })
                }else{
                    res.redirect('/');
                }
            }
        }
    })
};
destinationsController.createDestination = (req, res, next)=>{
    var destino={
        nombre_viaje: req.body.nombre,
        fechas: req.body.fecha,
        descripcion: req.body.descripcion,
        imagen: "/uploads/" + req.file.filename,
        precio: req.body.precio,
        activo: req.body.activo
    }

    destinationsModel.createDestination(destino,(err,result)=>{
        if(err) {
            res.status(500).json(err);
        }else{
            if(!req.session.username){
                res.redirect('/');
            }else{
                if(req.session.isAdmin){
                    req.flash('correcto','Se ha creado el viaje correctamente!')
                    res.redirect('/admins/adminpanel');
                }else{
                    res.redirect('/');
                }
            }
        }
    })
};

destinationsController.deleteDestination = (req, res, next) =>{
    destinationsModel.deleteDestination(req.params.id, (err, result)=>{
        if(err){
            res.status(500).json(err);
        }else{
            if(!req.session.username){
                res.redirect('/');
            }else{
                if(req.session.isAdmin){
                    req.flash('error','Se ha borrado el registro '+req.params.id+'!')
                    res.redirect('/admins/adminpanel');
                }else{
                    res.redirect('/');
                }
            }
        }
    })
};

destinationsController.activaDestination = (req, res, next) => {
    destinationsModel.activaDestination(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            if (!req.session.username) {
                res.redirect('/');
            } else {
                if (req.session.isAdmin) {
                    req.flash('error', 'Se ha cambiado el campo activo del usuario ' + req.params.id + '!')
                    res.redirect('/admins/adminpanel');
                } else {
                    res.redirect('/');
                }
            }
        }
    })
}

module.exports = destinationsController;

