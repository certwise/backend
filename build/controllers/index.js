"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardView = void 0;
var database_1 = require("../database");
var getDashboardView = function (req, res) {
    (0, database_1.dashboardView)(req.params.organizationId).then(function (result) {
        res.json(result);
    });
};
exports.getDashboardView = getDashboardView;
