const Multer=require('multer');
var express=require('express');
var router=express.Router();

const storage= Multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads/");
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname);
    }
});
const upload=Multer({storage});

module.exports=upload;