"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.updateGroup = exports.getGroups = exports.getGroup = exports.createGroup = void 0;
var functions_1 = require("./functions");
var createGroup = function (req, res) {
    (0, functions_1.createGroup_)(req.body).then(function (group) {
        if (group)
            res.send(group);
        else
            res.status(400).send({ message: "Error creating group" });
    });
};
exports.createGroup = createGroup;
var getGroup = function (req, res) {
    (0, functions_1.getGroup_)(req.params.id).then(function (group) {
        if (group)
            res.send(group);
        else
            res.status(400).send({ message: "Error getting group" });
    });
};
exports.getGroup = getGroup;
var getGroups = function (req, res) {
    (0, functions_1.getGroups_)(req.params.instituteId).then(function (groups) {
        if (groups)
            res.send(groups);
        else
            res.status(400).send({ message: "Error getting group" });
    });
};
exports.getGroups = getGroups;
var updateGroup = function (req, res) {
    (0, functions_1.updateGroup_)(req.body).then(function (group) {
        if (group)
            res.send(group);
        else
            res.status(400).send({ message: "Error updating group" });
    });
};
exports.updateGroup = updateGroup;
var deleteGroup = function (req, res) {
    res.send("Group test");
};
exports.deleteGroup = deleteGroup;
