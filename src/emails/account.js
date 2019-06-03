const sgMail = require("@sendgrid/mail");

const sendgridKey = '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';
sgMail.setApiKey(sendgridKey);

sgMail.send({
    to:"gabrieloliveira12488@gmail.com",
    from:"gabrieloliveira12488@gmail.com",
    subject:"This is my first Creation!",
    text:"This email was sended by node js"
})



