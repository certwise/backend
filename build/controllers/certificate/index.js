"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteCertificates = exports.deleteCertificate = exports.bulkUpdateCertificates = exports.updateCertificate = exports.bulkCreateCertificates = exports.getCertificatesByTemplate = exports.createSingleCertificate = exports.getAllCertificatesByUID = exports.getCertificate = void 0;
var apiFunctions_1 = require("./apiFunctions");
var getCertificate = function (req, res) {
    res.send("getCertificate");
};
exports.getCertificate = getCertificate;
var getAllCertificatesByUID = function (req, res) {
    var uid = req.params.uid;
    (0, apiFunctions_1.getAllCertificatesByUID_)(uid).then(function (certificates) {
        if (certificates !== false)
            res.status(200).send(certificates);
        else
            res.status(400).send("No certificates found");
    });
};
exports.getAllCertificatesByUID = getAllCertificatesByUID;
var createSingleCertificate = function (req, res) {
    (0, apiFunctions_1.createSingleCertificate_)(req.body).then(function (result) {
        if (result)
            res.status(200).send(result);
        else
            res.status(400).send(result);
    });
};
exports.createSingleCertificate = createSingleCertificate;
var getCertificatesByTemplate = function (req, res) {
    var templateId = req.params.templateId;
    (0, apiFunctions_1.getCertificatesByTemplate_)(templateId).then(function (result) {
        if (result !== false)
            res.status(200).send(result);
        else
            res.status(400).send(result);
    });
};
exports.getCertificatesByTemplate = getCertificatesByTemplate;
var bulkCreateCertificates = function (req, res) {
    res.send("Test");
};
exports.bulkCreateCertificates = bulkCreateCertificates;
var updateCertificate = function (req, res) {
    (0, apiFunctions_1.updateCertificate_)(req.body).then(function (result) {
        if (result)
            res.status(200).send(result);
        else
            res.status(400).send(result);
    });
};
exports.updateCertificate = updateCertificate;
var bulkUpdateCertificates = function (req, res) {
    res.send("Test");
};
exports.bulkUpdateCertificates = bulkUpdateCertificates;
var deleteCertificate = function (req, res) {
    res.status(200).send("Test");
};
exports.deleteCertificate = deleteCertificate;
var bulkDeleteCertificates = function (req, res) {
    res.send("Test");
};
exports.bulkDeleteCertificates = bulkDeleteCertificates;
