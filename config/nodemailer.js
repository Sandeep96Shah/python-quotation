const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mscodeialweb@gmail.com", // generated ethereal user
      pass: "lzxspnlvsaqezvxs", // generated ethereal password
    },
  });

  module.exports = {
    transporter,
  }