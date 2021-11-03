"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCustomer = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
var functions_1 = require("./functions");
var createUser = function (req, res) {
    (0, functions_1.createUser_)(req.body).then(function (user) {
        res.send(user);
    });
};
exports.createUser = createUser;
var getUser = function (req, res) {
    (0, functions_1.getUser_)(req.params.uid).then(function (user) {
        console.log(user);
        res.send(user);
    });
};
exports.getUser = getUser;
var updateUser = function (req, res) {
    (0, functions_1.updateUser_)(req.body).then(function (user) {
        res.send(user);
    });
};
exports.updateUser = updateUser;
var deleteUser = function (req, res) {
    res.send("User test");
};
exports.deleteUser = deleteUser;
var createStripeCustomer = function (req, res) {
    (0, functions_1.createStripeCustomer_)(req.body.uid, req.body.name, req.body.email).then(function (user) {
        res.send(user);
    });
};
exports.createStripeCustomer = createStripeCustomer;
