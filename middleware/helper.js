'use strict';
const Mongodb = require("./db");
const MSG91 = require("./MSG91");

const self = {
    createUser: function(data, callback) {
        var response = {};
        const userInfo = {
            "mobile": data.mobile
        };
        Mongodb.onConnect(function(db, ObjectID) {
            db.collection('smsVerify').findOne(data, function(err, result) {
                if (err) {
                    response.process = false;
                    response.isUserExists = false;
                    response.message = "Something went Wrong,try after sometime.";
                } else {
                    if (result != null) {
                        response.process = true;
                        response.isUserExists = true;
                        response.message = "User already exists.";
                        callback(response);
                    } else {
                        db.collection('smsVerify').insertOne(data, function(err, result) {
                            if (err) {
                                response.process = false;
                                response.isUserExists = false;
                                response.isUserAdded = false;
                                response.message = "Something went Wrong,try after sometime.";
                            } else {
                                response.process = true;
                                response.isUserExists = false;
                                response.isUserAdded = true;
                                response.id = result.ops[0]._id;
                                response.message = "User added.";
                            }
                            callback(response);
                        });
                    }
                }
            });
        });
    },
    isUserExists: function(data, callback) {
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            db.collection('smsVerify').findOne(data, function(err, result) {
                if (result != null) {
                    response.process = "success";
                    response.isUserExists = true;
                    response.id = result._id;
                } else {
                    response.process = "failed";
                    response.isUserExists = false;
                }
                callback(response);
            });
        });
    },
    getUserInfo: function(data, callback) {
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            data._id = new ObjectID(data._id);
            db.collection('smsVerify').findOne(data, function(err, result) {
                if (result != null) {
                    response.process = "success";
                    result.mobile = (result.mobile).substr((result.mobile).length - 4);
                    response.data = {

                        mobile: result.mobile,

                    };
                } else {
                    response.process = "failed";
                    response.isUserExists = false;
                }
                callback(response);
            });
        });
    },
    sendOtp: function(data, callback) {
        console.log(data);
        var OTP = self.generateOtp();
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            data._id = new ObjectID(data._id);
            db.collection('smsVerify').findOne(data, function(err, result) {
                console.log(result.mobile);

                if (result != null) {
                    if (result.mobile == "" || result.mobile == null) {
                        response.process = false;
                        response.message = "Invalid Number";
                        callback(response);
                    } else {
                        MSG91.sendSms(OTP, result.mobile, function(err, result) {
                            console.log(err);
                            if (err) {
                                response.process = false;
                                response.otpCreated = "Something went Wrong Please try after sometime.";
                            } else {
                                response.process = true;
                                response.message = "Your OTP is Created.";
                                response.otp = OTP;
                            }
                            console.log(response);
                            callback(response);
                        });
                    }
                } else {
                    response.process = false;
                    response.message = "Invalid Number";
                    callback(response);
                }
            });
        });
    },
    verifyOtp: function(data, otpData, callback) {
        const sessionOtp = parseInt(otpData.otp);
        const sessionUserID = otpData.id;
        const UserOtp = parseInt(data.otp);
        const userID = data.id;
        var response = {};
        if (UserOtp == "" || typeof UserOtp == "" || UserOtp == null) {
            response.isVerified = false;
            response.message = "OTP is destroyed,Please resend OTP.";
            callback(response);
        } else {
            if (UserOtp === sessionOtp) {
                self.activateVerification(userID, function(result) {
                    if (result.isError) {
                        response.isVerified = true;
                        response.message = "Something went Wrong at our end.";
                    } else {
                        response.isVerified = true;
                        response.message = "Your Number is Verified";
                    }
                    callback(response);
                });
            } else {
                response.isVerified = false;
                response.message = "OTP does not match.";
                callback(response);
            }
        }
    },
    activateVerification: function(userID, callback) {
        var response = {};
        Mongodb.onConnect(function(db, ObjectID) {
            db.collection('smsVerify').updateOne({
                _id: new ObjectID(userID)
            }, {
                $set: { isVerified: true }
            }, function(err, results) {
                if (err) {
                    console.log(err);
                    response.isError = true;
                    response.isVerified = false;
                    callback(response);
                } else {
                    console.log(results.result.nModified);
                    if (results.result.nModified > 0) {
                        response.isError = false;
                        response.isVerified = true;
                    } else {
                        response.isError = true;
                        response.isVerified = false;
                    }
                    callback(response);
                }
            });
        });
    },
    generateOtp: function() {
        return Math.floor(Math.random() * 100000) + 99999;
    },
    getBalance: function(callback) {
        MSG91.getBalance(function() {
            callback();
        });
    }
}
module.exports = self;