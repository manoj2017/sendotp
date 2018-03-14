'use strict';

/* msg91 constants starts */

const API_KEY = '114335ASTLKgIgq9M574958c5';
const SENDER_ID = "VERIFY";
const ROUTE_NO = 4;

/* msg91 constants starts */

var msg91 = require("msg91")(API_KEY, SENDER_ID, ROUTE_NO );

const self={
	sendSms : function(OTP,mobileNo,callback){

		var MESSAGE = "Welcome to codershood.info. your OTP is "+OTP;

		msg91.send(mobileNo, MESSAGE, function(err, response){
			callback(err,response);
		});
	},
	getBalance:function(callback){
		msg91.getBalance(ROUTE_NO, function(err, msgCount){
			console.log(err);
			console.log(msgCount);
			callback();
		});
	}
}
module.exports = self;