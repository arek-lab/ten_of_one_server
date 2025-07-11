const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(mg(auth));

  return transporter.sendMail({
    from: 'postmaster@sandbox963958df4cf44ed7995bb35fc7d4099e.mailgun.org', // sender address
    to,
    subject,
    html,
  });
};

// const sendEmail = async ({ to, subject, html }) => {
//   let testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     nodemailerConfig,
//   });

//   return transporter.sendMail({
//     from: '"Codding Addict" <coddingaddict@gmail.com>', // sender address
//     to,
//     subject,
//     html,
//   });
// };

module.exports = sendEmail;
