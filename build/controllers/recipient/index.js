"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipient = exports.updateRecipient = exports.getRecipient = exports.createRecipient = void 0;
var functions_1 = require("./functions");
var createRecipient = function (req, res) {
    (0, functions_1.createRecipient_)(req.body).then(function (recipient) {
        if (recipient)
            res.send(recipient);
        else
            res.status(400).send({ message: "Error creating recipient" });
    });
};
exports.createRecipient = createRecipient;
var getRecipient = function (req, res) {
    (0, functions_1.getRecipient_)(req.params.id).then(function (recipient) {
        if (recipient)
            res.send(recipient);
        else
            res.status(400).send({ message: "Error getting recipient" });
    });
};
exports.getRecipient = getRecipient;
var updateRecipient = function (req, res) {
    (0, functions_1.updateRecipient_)(req.body).then(function (recipient) {
        if (recipient)
            res.send(recipient);
        else
            res.status(400).send({ message: "Error updating recipient" });
    });
};
exports.updateRecipient = updateRecipient;
var deleteRecipient = function (req, res) {
    res.send("Recipient test");
};
exports.deleteRecipient = deleteRecipient;
