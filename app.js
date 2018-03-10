const SendOtp = require('sendotp');
const sendOtp = new SendOtp('201900AZxKhMho5aa3405d');


sendOtp.send("+917011267648", "MANOJKS", SendOtp.generateOtp(), function(error, data, response) {
    console.log(data);
});