let conn= require ('.././connections/mysqlconnection');

let destinations= {};

destinations.getAllDestinations = (cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('SELECT * FROM destinos',function (err,destinos) {
        if (err) return cb(err);
        console.log(destinos);
        return cb(err,destinos);
    })
};

destinations.getDestinations = (cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('SELECT * FROM destinos where activo=1',function (err,destinos) {
        if (err) return cb(err);
        //console.log(destinos);
        return cb(err,destinos);
    })
};


destinations.createDestination = (destino,cb) =>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('INSERT INTO destinos SET ?',destino,function (err,res) {
        if (err) return cb(err);
        return cb(err,res);
    })
};

destinations.deleteDestination = (id,cb) =>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('DELETE FROM destinos WHERE id=?',id,function (err,res) {
        if (err) return cb(err);
        return cb(err, res);
    })
}

destinations.activaDestination=(id,cb)=> {
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query("SELECT * FROM destinos WHERE id=?", id, function (error, resultado) {
        if (error) return cb(error);
        else {
            let valorActivo = resultado[0].activo;
            if (valorActivo == 1)
                valorActivo = 0;
            else
                valorActivo = 1;
            conn.query("Update destinos set activo=" + valorActivo + " where id=?", id, function (error, resultado) {
                if (error) return cb(error);
                return cb(null, resultado);
            })
        }
    })
}

destinations.paginate =(offset, limit, cb)=>{
    if(conn) {
        conn.query("SELECT * FROM  destinos LIMIT ?, ?", [offset, limit],(error,rows)=>{
            if(error){
                return cb(error);
            }else{
                conn.query("SELECT COUNT(*) as total FROM destinos",(error, count)=>{
                    if(error) {
                        return cb(error)
                    }else{
                        return cb(null,{count,rows});
                    }
                })
            }
        })
    }
}

module.exports= destinations;