"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipient = exports.recipientSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.recipientSchema = joi_1.default.object().keys({
    id: joi_1.default.string().optional().allow("").allow(null),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required(),
    name: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required(),
    organization: joi_1.default.string().required(),
    customFields: joi_1.default.array()
        .items(joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        value: joi_1.default.string().required(),
    }))
        .required(),
    groups: joi_1.default.array().items(joi_1.default.string()).required(),
    certificates: joi_1.default.array().items(joi_1.default.string()).required(),
});
var Recipient = /** @class */ (function () {
    function Recipient(recipient) {
        this.email = recipient.email;
        this.name = recipient.name;
        this.createdAt = recipient.createdAt;
        this.customFields = recipient.customFields;
        this.organization = recipient.organization;
        this.groups = recipient.groups;
        this.certificates = recipient.certificates;
    }
    Recipient.prototype.validate = function () {
        var error = exports.recipientSchema.validate(this).error;
        if (error) {
            return {
                error: true,
                message: error.details[0].message,
            };
        }
        else {
            return {
                error: false,
                message: "",
            };
        }
    };
    Recipient.prototype.create = function (dbCreateRecipient) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbCreateRecipient(__assign({}, _this))
                .then(function (recipient) {
                resolve(recipient);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Recipient.prototype.update = function (dbUpdateRecipient) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbUpdateRecipient(__assign({}, _this))
                .then(function (recipient) {
                resolve(recipient);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Recipient.get = function (id, dbGetRecipient) {
        return new Promise(function (resolve, reject) {
            dbGetRecipient(id)
                .then(function (recipient) {
                resolve(recipient);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Recipient.getByOrganization = function (organization, dbGetByOrganization) {
        return new Promise(function (resolve, reject) {
            dbGetByOrganization(organization)
                .then(function (recipients) {
                resolve(recipients);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Recipient.getByGroup = function (group, dbGetByGroup) {
        return new Promise(function (resolve, reject) {
            dbGetByGroup(group)
                .then(function (recipients) {
                resolve(recipients);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return Recipient;
}());
exports.Recipient = Recipient;
