const nodemailer = require('nodemailer');

module.exports = async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = modemailer.createTransporter({
        host:'smtp.ethereal.email',
        post: 587,
        secure: false, // true for 465, false for other ports
        auth:{
            user: testAccount.user,
            pass: testAccount.pass
        }

    })
    return transporter;
}