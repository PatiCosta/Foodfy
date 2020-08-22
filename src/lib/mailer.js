const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8b9f80a024a733",
    pass: "68ca6a14ae9de6"
  }
});

