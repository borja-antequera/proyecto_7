const Nodemailer = require('nodemailer');
let email={};


email.transporter=Nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'borjaantequera@gmail.com',
            pass: 'hatfield78'
        },
    },
    {
    from:'borjaantequera@gmail.com',
    headers:{
    }
})

module.exports=email;
