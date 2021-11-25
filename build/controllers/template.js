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
exports.getNumberOfCertificates = exports.getFields = exports.deleteTemplate = exports.update = exports.getByOrganization = exports.getById = exports.create = void 0;
var template_1 = require("../models/template");
var db = __importStar(require("../database/template"));
var create = function (req, res) {
    var template = new template_1.Template(req.body);
    var isValid = template.validate();
    if (isValid.error) {
        res.status(400).send("Template not valid. " + isValid.message);
    }
    else {
        template
            .create(db.create)
            .then(function () {
            res.status(201).send(template);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
};
exports.create = create;
var getById = function (req, res) {
    var templateId = req.params.templateId;
    template_1.Template.getOne(templateId, db.getOne)
        .then(function (template) {
        res.status(200).send(template);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.getById = getById;
var getByOrganization = function (req, res) {
    var org = req.params.organization;
    template_1.Template.getByOrganization(org, db.getByOrganization)
        .then(function (templates) {
        res.status(200).send(templates);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.getByOrganization = getByOrganization;
var update = function (req, res) {
    var template = new template_1.Template(req.body);
    var isValid = template.validate();
    if (isValid.error) {
        res.status(400).send("Template not valid. " + isValid.message);
    }
    else {
        template
            .update(db.update)
            .then(function (updatedTemplate) {
            res.status(200).send(updatedTemplate);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
};
exports.update = update;
var deleteTemplate = function (req, res) {
    template_1.Template.delete(req.params.templateId, db.deleteTemplate)
        .then(function () {
        res.status(200).send();
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.deleteTemplate = deleteTemplate;
var getFields = function (req, res) {
    var templateId = req.params.templateId;
    template_1.Template.getOne(templateId, db.getOne).then(function (template) {
        var t = new template_1.Template(template);
        var fields = t.getAllFields();
        res.status(200).send(fields);
    });
};
exports.getFields = getFields;
var getNumberOfCertificates = function (req, res) {
    var templateId = req.params.templateId;
    template_1.Template.getOne(templateId, db.getOne)
        .then(function (template) {
        var t = new template_1.Template(template);
        var numberOfCertificates = t.numberOfCertificates;
        res.status(200).send(numberOfCertificates);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.getNumberOfCertificates = getNumberOfCertificates;
