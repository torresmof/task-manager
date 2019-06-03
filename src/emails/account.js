const sgMail = require("@sendgrid/mail");

const sendgridKey = process.env.SENDGRIDKEY;
sgMail.setApiKey(sendgridKey);

sgMail.send({
    to:"gabrieloliveira12488@gmail.com",
    from:"gabrieloliveira12488@gmail.com",
    subject:"This is my first Creation!",
    text:"This email was sended by node js"
})



