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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.groupSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.groupSchema = joi_1.default.object().keys({
    _id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required(),
    updatedAt: joi_1.default.date().required(),
    organization: joi_1.default.string().required().allow(""),
    createdBy: joi_1.default.string().required(),
    customFields: joi_1.default.array()
        .items(joi_1.default.object().keys({
        name: joi_1.default.string().optional(),
        value: joi_1.default.string().optional(),
        type: joi_1.default.string().optional(),
    }))
        .required(),
    color: joi_1.default.string().required(),
});
var Group = /** @class */ (function () {
    function Group(group) {
        if (group._id)
            this._id = group._id;
        this.name = group.name;
        this.description = group.description;
        this.createdAt = group.createdAt;
        this.updatedAt = group.updatedAt;
        this.organization = group.organization;
        this.createdBy = group.createdBy;
        this.customFields = group.customFields;
        this.color = group.color;
    }
    Group.prototype.validate = function () {
        var error = exports.groupSchema.validate(this).error;
        var valid = error == null;
        if (valid) {
            return { error: false, message: "" };
        }
        else {
            var details = error.details;
            var message = details.map(function (i) { return i.message; }).join(",");
            console.log("error", message);
            return { error: true, message: message };
        }
    };
    Group.prototype.create = function (dbCreateGroup) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbCreateGroup(__assign({}, _this))
                .then(function (newGroup) {
                resolve(newGroup);
            })
                .catch(function (err) {
                reject("Database writing error" + err);
            });
        });
    };
    Group.prototype.update = function (dbUpdateGroup) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (exports.groupSchema.validate(_this))
                dbUpdateGroup(__assign({}, _this))
                    .then(function (res) {
                    resolve(res);
                })
                    .catch(function () {
                    reject("Database updating error");
                });
        });
    };
    Group.delete = function (groupId, dbDeleteGroup) {
        return new Promise(function (resolve, reject) {
            dbDeleteGroup(groupId)
                .then(function () {
                resolve();
            })
                .catch(function () {
                reject("Database deleting error");
            });
        });
    };
    Group.getOne = function (groupId, dbGetGroup) {
        return new Promise(function (resolve, reject) {
            dbGetGroup(groupId)
                .then(function (group) {
                resolve(group);
            })
                .catch(function () {
                reject("Database reading error");
            });
        });
    };
    Group.getByOrganization = function (organizationId, dbGetGroups) {
        return new Promise(function (resolve, reject) {
            dbGetGroups(organizationId)
                .then(function (groups) {
                resolve(groups);
            })
                .catch(function () {
                reject("Database reading error");
            });
        });
    };
    Group.prototype.setCustomFields = function (customFields, dbUpdateGroup) {
        var data = __assign({}, this);
        data.customFields = customFields;
        return new Promise(function (resolve, reject) {
            dbUpdateGroup(data)
                .then(function (res) {
                resolve(res);
            })
                .catch(function () {
                reject("Database writing error");
            });
        });
    };
    Group.prototype.addCustomField = function (customField, dbUpdateGroup) {
        var data = __assign({}, this);
        if (data.customFields)
            data.customFields = __spreadArray(__spreadArray([], data.customFields, true), [customField], false);
        else
            data.customFields = [customField];
        return new Promise(function (resolve, reject) {
            dbUpdateGroup(data)
                .then(function (res) {
                resolve(res);
            })
                .catch(function () {
                reject("Database writing error");
            });
        });
    };
    Group.prototype.removeCustomField = function (customFieldName, dbUpdateGroup) {
        var data = __assign({}, this);
        if (data.customFields) {
            data.customFields = data.customFields.filter(function (field) { return field.name !== customFieldName; });
        }
        return new Promise(function (resolve, reject) {
            dbUpdateGroup(data)
                .then(function (res) {
                resolve(res);
            })
                .catch(function () {
                reject("Database writing error");
            });
        });
    };
    return Group;
}());
exports.Group = Group;
