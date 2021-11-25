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
exports.deleteOrg = exports.update = exports.get = exports.create = void 0;
var organization_1 = require("../models/organization");
var db = __importStar(require("../database/organization"));
var create = function (req, res) {
    var org = new organization_1.Organization(req.body);
    var isValid = org.validate();
    if (!isValid.error) {
        org
            .create(db.create)
            .then(function () {
            res.send(org);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
    else {
        res.status(400).send(isValid.error);
    }
};
exports.create = create;
var get = function (req, res) {
    var org = req.params.organization;
    organization_1.Organization.get(org, db.get)
        .then(function (org) {
        res.status(200).send(org);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.get = get;
var update = function (req, res) {
    var org = new organization_1.Organization(req.body);
    var isValid = org.validate();
    if (!isValid.error) {
        org
            .update(db.update)
            .then(function () {
            res.send(org);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
    else {
        res.status(400).send(isValid.error);
    }
};
exports.update = update;
var deleteOrg = function (req, res) {
    res.send("Organization test");
};
exports.deleteOrg = deleteOrg;
