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
exports.deleteGroup = exports.update = exports.getByOrganization = exports.getOne = exports.create = void 0;
var group_1 = require("../models/group");
var db = __importStar(require("../database/group"));
var create = function (req, res) {
    var group = new group_1.Group(req.body);
    var isValid = group.validate();
    if (!isValid.error) {
        group
            .create(db.create)
            .then(function (group) {
            res.status(200).send(group);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
    else {
        res.status(400).send(isValid.message);
    }
};
exports.create = create;
var getOne = function (req, res) {
    var id = req.params.group;
    group_1.Group.getOne(id, db.getOne)
        .then(function (group) {
        res.status(200).send(group);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.getOne = getOne;
var getByOrganization = function (req, res) {
    group_1.Group.getByOrganization(req.params.organization, db.getByOrganization)
        .then(function (groups) {
        res.status(200).send(groups);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.getByOrganization = getByOrganization;
var update = function (req, res) {
    var group = new group_1.Group(req.body);
    var isValid = group.validate();
    if (!isValid.error) {
        group
            .update(db.update)
            .then(function (group) {
            res.status(200).send(group);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
    else {
        res.status(400).send(isValid.message);
    }
};
exports.update = update;
var deleteGroup = function (req, res) {
    group_1.Group.delete(req.params.group, db.deleteGroup)
        .then(function (group) {
        res.status(200).send(group);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.deleteGroup = deleteGroup;
