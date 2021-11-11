"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstitution = exports.updateInstitution = exports.getInstitution = exports.createInstitution = void 0;
var functions_1 = require("./functions");
var createInstitution = function (req, res) {
    (0, functions_1.createInstitution_)(req.body).then(function (institution) {
        if (institution)
            res.send(institution);
        else
            res.status(400).send({ message: "Error creating institution" });
    });
};
exports.createInstitution = createInstitution;
var getInstitution = function (req, res) {
    (0, functions_1.getInstitution_)(req.params.id).then(function (institution) {
        if (institution)
            res.send(institution);
        else
            res.status(400).send({ message: "Error getting institution" });
    });
};
exports.getInstitution = getInstitution;
var updateInstitution = function (req, res) {
    (0, functions_1.updateInstitution_)(req.body).then(function (institution) {
        if (institution)
            res.send(institution);
        else
            res.status(400).send({ message: "Error updating institution" });
    });
};
exports.updateInstitution = updateInstitution;
var deleteInstitution = function (req, res) {
    res.send("Institution test");
};
exports.deleteInstitution = deleteInstitution;
