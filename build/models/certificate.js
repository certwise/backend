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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = exports.certificateSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.certificateSchema = joi_1.default.object().keys({
    _id: joi_1.default.string().optional(),
    issuer: joi_1.default.string().required(),
    isIssued: joi_1.default.boolean().required().default(false),
    templateId: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required(),
    lastUpdated: joi_1.default.date().required(),
    issueDate: joi_1.default.alternatives()
        .try(joi_1.default.date(), joi_1.default.boolean().valid(false))
        .required(),
    recipient: joi_1.default.string().required(),
    fields: joi_1.default.array()
        .items(joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        value: joi_1.default.string().required(),
    }))
        .required(),
    group: joi_1.default.string().required().allow(false),
    validTill: joi_1.default.date().required().allow(false),
    storageRef: joi_1.default.string().optional(),
    isRevoked: joi_1.default.boolean().required().default(false),
    organization: joi_1.default.string().required(),
});
var Certificate = /** @class */ (function () {
    function Certificate(data) {
        if (data._id)
            this._id = data._id;
        this.issuer = data.issuer;
        this.isIssued = data.isIssued;
        this.templateId = data.templateId;
        this.createdAt = data.createdAt;
        this.lastUpdated = data.lastUpdated;
        this.issueDate = data.issueDate;
        this.recipient = data.recipient;
        this.fields = data.fields;
        this.group = data.group;
        this.validTill = data.validTill;
        this.isRevoked = data.isRevoked;
        this.organization = data.organization;
    }
    Certificate.prototype.validate = function () {
        var error = exports.certificateSchema.validate(this).error;
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
    Certificate.prototype.create = function (dbCreate, getTemplateImage, uploadBufferToStorage) {
        return __awaiter(this, void 0, void 0, function () {
            var createdCert, templateImageBuffer, storageRef, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, dbCreate(__assign({}, this))];
                    case 1:
                        createdCert = _a.sent();
                        return [4 /*yield*/, getTemplateImage(createdCert.templateId, createdCert.fields)];
                    case 2:
                        templateImageBuffer = _a.sent();
                        storageRef = "".concat(createdCert.organization, "/certificates/").concat(createdCert._id, ".jpg");
                        return [4 /*yield*/, uploadBufferToStorage(templateImageBuffer, storageRef)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, createdCert];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error(err_1.toString());
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Certificate.createMany = function (certificates, dbCreateMany, getTemplateImage, uploadBufferToStorage) {
        return __awaiter(this, void 0, void 0, function () {
            var createdCertificates, promises, imageBuffers, imagePromises, storageRefs, certificatesWithStorageRefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbCreateMany(certificates)];
                    case 1:
                        createdCertificates = _a.sent();
                        console.log("Created many certificates:", createdCertificates);
                        promises = [];
                        createdCertificates.forEach(function (certificate) {
                            console.log("Creating certificate image for:", certificate._id);
                            var templateImageBuffer = getTemplateImage(certificate.templateId, certificate.fields);
                            promises.push(templateImageBuffer);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        imageBuffers = _a.sent();
                        imagePromises = [];
                        imageBuffers.forEach(function (imageBuffer, index) {
                            var storageRef = "".concat(createdCertificates[index].organization, "/certificates/").concat(createdCertificates[index]._id, ".jpg");
                            imagePromises.push(uploadBufferToStorage(imageBuffer, storageRef));
                        });
                        return [4 /*yield*/, Promise.all(imagePromises)];
                    case 3:
                        storageRefs = _a.sent();
                        certificatesWithStorageRefs = certificates.map(function (certificate, index) {
                            return __assign(__assign({}, certificate), { storageRef: storageRefs[index] });
                        });
                        return [2 /*return*/, certificatesWithStorageRefs];
                }
            });
        });
    };
    Certificate.prototype.update = function (dbUpdate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbUpdate(__assign({}, _this))
                .then(function (certificate) {
                resolve(certificate);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.prototype.delete = function (dbDelete) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._id) {
                var id = _this._id;
                dbDelete(id)
                    .then(function () {
                    resolve();
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            else {
                reject();
            }
        });
    };
    Certificate.getOne = function (certificateId, dbGetOne) {
        return new Promise(function (resolve, reject) {
            dbGetOne(certificateId)
                .then(function (certificate) {
                resolve(certificate);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.getByOrganizaion = function (organizationId, dbGetByOrganization) {
        return new Promise(function (resolve, reject) {
            dbGetByOrganization(organizationId)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.getByGroup = function (groupId, dbGetByGroup) {
        return new Promise(function (resolve, reject) {
            dbGetByGroup(groupId)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.getByTemplate = function (templateId, dbGetByTemplate) {
        return new Promise(function (resolve, reject) {
            dbGetByTemplate(templateId)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.getByIssuer = function (issuer, dbGetCertificatesByIssuer) {
        return new Promise(function (resolve, reject) {
            dbGetCertificatesByIssuer(issuer)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.getByRecipient = function (recipient, dbGetCertificatesByRecipient) {
        return new Promise(function (resolve, reject) {
            dbGetCertificatesByRecipient(recipient)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.prototype.getRevoked = function (organizationId, dbGetRevoked) {
        return new Promise(function (resolve, reject) {
            dbGetRevoked(organizationId)
                .then(function (certificates) {
                resolve(certificates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.prototype.revoke = function (dbUpdate) {
        var data = __assign({}, this);
        data.isRevoked = true;
        data.lastUpdated = new Date();
        return new Promise(function (resolve, reject) {
            dbUpdate(data)
                .then(function (certificate) {
                resolve(certificate);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Certificate.prototype.issue = function (dbUpdate, sendEmail) {
        var data = __assign({}, this);
        data.isRevoked = false;
        data.lastUpdated = new Date();
        data.isIssued = true;
        return new Promise(function (resolve, reject) {
            dbUpdate(data)
                .then(function () {
                return sendEmail(data.recipient, data.templateId);
            })
                .then(function () {
                console.log("Email sent");
                resolve(data);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return Certificate;
}());
exports.Certificate = Certificate;
