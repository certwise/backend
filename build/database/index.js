"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardView = void 0;
var monk_1 = __importDefault(require("monk"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var db = (0, monk_1.default)(process.env.MONGO_URI);
exports.default = db;
var certificateCollection = db.get("certificates");
var templateCollection = db.get("templates");
var recipientCollection = db.get("recipients");
var groupCollection = db.get("groups");
var dashboardView = function (organizationId) {
    return new Promise(function (resolve, reject) {
        var certificateCount = certificateCollection.count({
            organization: organizationId,
        });
        var issuedCount = certificateCollection.count({
            organization: organizationId,
            isIssued: true,
            isRevoked: false,
        });
        var revokedCount = certificateCollection.count({
            organization: organizationId,
            isRevoked: true,
        });
        var createdCount = certificateCollection.count({
            organization: organizationId,
            isIssued: false,
            isRevoked: false,
        });
        var templateCount = templateCollection.count({
            organization: organizationId,
        });
        var archivedCount = templateCollection.count({
            organization: organizationId,
            isArchived: true,
        });
        var recipientsCount = recipientCollection.count({
            organization: organizationId,
        });
        var recipientsNotInGroup = recipientCollection.count({
            organization: organizationId,
            group: [],
        });
        var groupCount = groupCollection.count({ organization: organizationId });
        Promise.all([
            certificateCount,
            issuedCount,
            revokedCount,
            createdCount,
            templateCount,
            archivedCount,
            recipientsCount,
            recipientsNotInGroup,
            groupCount,
        ]).then(function (result) {
            console.log(result);
            resolve({
                certificates: {
                    total: result[0],
                    issued: result[1],
                    revoked: result[2],
                    created: result[3],
                },
                templates: {
                    total: result[4],
                    archived: result[5],
                },
                recipients: {
                    total: result[6],
                    notInGroup: result[7],
                },
                groups: result[8],
            });
        });
    });
};
exports.dashboardView = dashboardView;
