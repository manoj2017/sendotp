const SendOtp = require('sendotp');
const sendOtp = new SendOtp('201900AZxKhMho5aa3405d');


sendOtp.send("+919718493150", "MANOJKS", SendOtp.generateOtp(), function(error, data, response) {
    console.log(data);
});