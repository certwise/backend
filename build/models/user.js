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
exports.User = exports.UserSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.UserSchema = joi_1.default.object().keys({
    uid: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    organization: joi_1.default.string().required().allow(""),
    isVerified: joi_1.default.boolean().required(),
    createdAt: joi_1.default.date().required(),
    photoURL: joi_1.default.string().optional(),
    updatedAt: joi_1.default.date().required(),
    numberOfTemplatesCreated: joi_1.default.number().required(),
    numberOfCerificatesCreated: joi_1.default.number().required(),
});
var User = /** @class */ (function () {
    function User(user) {
        this.uid = user.uid;
        this.name = user.name;
        this.email = user.email;
        this.organization = user.organization;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.numberOfTemplatesCreated = user.numberOfTemplatesCreated;
        this.numberOfCerificatesCreated = user.numberOfCerificatesCreated;
    }
    User.prototype.validate = function () {
        var error = exports.UserSchema.validate(this).error;
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
    User.prototype.create = function (dbCreate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log("user", _this);
            dbCreate(__assign({}, _this))
                .then(function (user) {
                resolve(user);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    User.prototype.update = function (dbUpdate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbUpdate(__assign({}, _this))
                .then(function (user) {
                resolve(user);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    User.get = function (uid, dbGet) {
        return new Promise(function (resolve, reject) {
            dbGet(uid)
                .then(function (user) {
                resolve(user);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    return User;
}());
exports.User = User;
