const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: "84d79595fe18e9",
      pass: "03b7819654ecae"
    }
  });

module.exports = {
  transport,
}
