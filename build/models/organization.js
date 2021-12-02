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
exports.Organization = exports.organizationSchema = exports.customFieldSchema = void 0;
var joi_1 = __importDefault(require("joi"));
var metaDataSchema = joi_1.default.object().keys({
    city: joi_1.default.string().optional().allow(""),
    country: joi_1.default.string().optional().allow(""),
    address: joi_1.default.string().optional().allow(""),
    phone: joi_1.default.string().optional().allow(""),
    website: joi_1.default.string().optional().allow(""),
    logo: joi_1.default.string().optional().allow(""),
    description: joi_1.default.string().optional().allow(""),
    picture: joi_1.default.string().optional().allow(""),
    postalCode: joi_1.default.string().optional().allow(""),
    state: joi_1.default.string().optional().allow(""),
});
exports.customFieldSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    type: joi_1.default.string().optional(),
    value: joi_1.default.string().optional(),
});
exports.organizationSchema = joi_1.default.object().keys({
    _id: joi_1.default.string().optional().allow(""),
    name: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required(),
    customFields: joi_1.default.array().items(exports.customFieldSchema).required(),
    lastUpdated: joi_1.default.date().required(),
    email: joi_1.default.string().email().required(),
    metaData: metaDataSchema.optional(),
});
var Organization = /** @class */ (function () {
    function Organization(organization) {
        if (organization._id)
            this._id = organization._id;
        this.name = organization.name;
        this.createdBy = organization.createdBy;
        this.createdAt = organization.createdAt;
        this.customFields = organization.customFields;
        this.lastUpdated = new Date();
        this.email = organization.email;
        if (organization.metaData)
            this.metaData = organization.metaData;
    }
    Organization.prototype.validate = function () {
        var error = exports.organizationSchema.validate(this).error;
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
    Organization.prototype.create = function (dbCreate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = __assign({}, _this);
            dbCreate(data)
                .then(function (organization) { return resolve(organization); })
                .catch(function (err) { return reject(err); });
        });
    };
    Organization.get = function (organization, dbGet) {
        return new Promise(function (resolve, reject) {
            dbGet(organization)
                .then(function (res) { return resolve(res); })
                .catch(function (err) { return reject(err); });
        });
    };
    Organization.prototype.update = function (dbUpdateOrganization) {
        var data = __assign({}, this);
        data.lastUpdated = new Date();
        return new Promise(function (resolve, reject) {
            dbUpdateOrganization(data)
                .then(function (organization) { return resolve(organization); })
                .catch(function (err) { return reject(err); });
        });
    };
    Organization.prototype.delete = function (dbDeleteOrganization) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbDeleteOrganization(__assign({}, _this))
                .then(function (organization) { return resolve(organization); })
                .catch(function (err) { return reject(err); });
        });
    };
    return Organization;
}());
exports.Organization = Organization;
