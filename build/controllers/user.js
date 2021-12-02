"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.update = exports.get = exports.create = void 0;
var user_1 = require("../models/user");
var db = __importStar(require("../database/user"));
var create = function (req, res) {
    console.log("create user");
    var user = new user_1.User(req.body);
    var isValid = user.validate();
    if (!isValid.error) {
        user
            .create(db.create)
            .then(function (user) { return res.status(201).send(user); })
            .catch(function (err) {
            console.log(err);
            res.status(500).send(err.message);
        });
    }
    else {
        console.log(isValid.message);
        res.status(400).send(isValid.message);
    }
};
exports.create = create;
var get = function (req, res) {
    user_1.User.get(req.params.uid, db.get)
        .then(function (user) {
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send("User not found");
        }
    })
        .catch(function (err) { return res.status(500).send(err.message); });
};
exports.get = get;
var update = function (req, res) {
    var user = new user_1.User(req.body);
    var isValid = user.validate();
    if (!isValid.error) {
        user
            .update(db.update)
            .then(function () { return res.status(200).send(user); })
            .catch(function (err) { return res.status(500).send(err.message); });
    }
    else {
        res.status(400).send(isValid.error);
    }
};
exports.update = update;
var deleteUser = function (req, res) {
    user_1.User.delete(req.params.uid, db.deleteUser)
        .then(function () { return res.status(200).send("User deleted"); })
        .catch(function (err) { return res.status(500).send(err.message); });
};
exports.deleteUser = deleteUser;
