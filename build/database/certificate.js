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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCertificateBuffertoStorage = exports.getRevokedByOrg = exports.getByIssuer = exports.getByRecipient = exports.update = exports.getByOrganization = exports.getByGroup = exports.getByTemplate = exports.getOne = exports.create = void 0;
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
var db = (0, firestore_1.getFirestore)();
var certificateCollection = (0, firestore_1.collection)(db, "certificates");
var create = function (certificate) { return __awaiter(void 0, void 0, void 0, function () {
    var templateCollection, certRef, templateDoc, templateRes, template, organizationCollection, oDoc, oRes, organization, recipientCollection, recipientDoc, recipientRes, recipient, groupCollection, groupDoc, groupRes, group;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                templateCollection = (0, firestore_1.collection)(db, "templates");
                return [4 /*yield*/, (0, firestore_1.addDoc)(certificateCollection, certificate)];
            case 1:
                certRef = _a.sent();
                templateDoc = (0, firestore_1.doc)(templateCollection, certificate.templateId);
                return [4 /*yield*/, (0, firestore_1.getDoc)(templateDoc)];
            case 2:
                templateRes = _a.sent();
                template = templateRes.data();
                console.log("create cert template:", template);
                template.numberOfCertificates++;
                if (template.certificates)
                    template.certificates.push(certRef.id);
                else
                    template.certificates = [certRef.id];
                return [4 /*yield*/, (0, firestore_1.setDoc)(templateDoc, template)];
            case 3:
                _a.sent(); //set in template
                organizationCollection = (0, firestore_1.collection)(db, "organizations");
                oDoc = (0, firestore_1.doc)(organizationCollection, certificate.organization);
                return [4 /*yield*/, (0, firestore_1.getDoc)(oDoc)];
            case 4:
                oRes = _a.sent();
                organization = oRes.data();
                console.log("create cert org:", organization);
                if (organization.certificates)
                    organization.certificates.push(certRef.id);
                else
                    organization.certificates = [certRef.id];
                return [4 /*yield*/, (0, firestore_1.setDoc)(oDoc, organization)];
            case 5:
                _a.sent(); //set in organization
                recipientCollection = (0, firestore_1.collection)(db, "recipients");
                recipientDoc = (0, firestore_1.doc)(recipientCollection, certificate.recipient);
                return [4 /*yield*/, (0, firestore_1.getDoc)(recipientDoc)];
            case 6:
                recipientRes = _a.sent();
                recipient = recipientRes.data();
                console.log("create cert reci:", recipient);
                if (recipient === null || recipient === void 0 ? void 0 : recipient.certificates)
                    recipient.certificates.push(certRef.id);
                else
                    recipient.certificates = [certRef.id];
                return [4 /*yield*/, (0, firestore_1.setDoc)(recipientDoc, recipient)];
            case 7:
                _a.sent(); //set in recipient
                groupCollection = (0, firestore_1.collection)(db, "groups");
                if (!(certificate.group !== false)) return [3 /*break*/, 10];
                groupDoc = (0, firestore_1.doc)(groupCollection, certificate.group);
                return [4 /*yield*/, (0, firestore_1.getDoc)(groupDoc)];
            case 8:
                groupRes = _a.sent();
                group = groupRes.data();
                if (group.certificates)
                    group.certificates.push(certRef.id);
                else
                    group.certificates = [certRef.id];
                return [4 /*yield*/, (0, firestore_1.setDoc)(groupDoc, group)];
            case 9:
                _a.sent(); //set in group
                _a.label = 10;
            case 10: return [2 /*return*/, __assign({ id: certRef.id }, certificate)];
        }
    });
}); };
exports.create = create;
var getOne = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var cert;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(certificateCollection, id))];
            case 1:
                cert = _a.sent();
                return [2 /*return*/, __assign(__assign({}, cert.data()), { id: id })];
        }
    });
}); };
exports.getOne = getOne;
var getByTemplate = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var cQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("templateId", "==", templateId));
                return [4 /*yield*/, (0, firestore_1.getDocs)(cQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByTemplate = getByTemplate;
var getByGroup = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var gQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("group", "==", group));
                return [4 /*yield*/, (0, firestore_1.getDocs)(gQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByGroup = getByGroup;
var getByOrganization = function (organization) { return __awaiter(void 0, void 0, void 0, function () {
    var oQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                oQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("organization", "==", organization));
                return [4 /*yield*/, (0, firestore_1.getDocs)(oQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByOrganization = getByOrganization;
var update = function (certificate) { return __awaiter(void 0, void 0, void 0, function () {
    var cDoc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cDoc = (0, firestore_1.doc)(certificateCollection, certificate.id);
                return [4 /*yield*/, (0, firestore_1.setDoc)(cDoc, certificate)];
            case 1:
                _a.sent();
                return [2 /*return*/, certificate];
        }
    });
}); };
exports.update = update;
var getByRecipient = function (recipient) { return __awaiter(void 0, void 0, void 0, function () {
    var rQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("recipient", "==", recipient));
                return [4 /*yield*/, (0, firestore_1.getDocs)(rQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByRecipient = getByRecipient;
var getByIssuer = function (issuer) { return __awaiter(void 0, void 0, void 0, function () {
    var iQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                iQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("issuer", "==", issuer));
                return [4 /*yield*/, (0, firestore_1.getDocs)(iQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByIssuer = getByIssuer;
var getRevokedByOrg = function (organization) { return __awaiter(void 0, void 0, void 0, function () {
    var iQuery, certs, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                iQuery = (0, firestore_1.query)(certificateCollection, (0, firestore_1.where)("organization", "==", organization), (0, firestore_1.where)("revoked", "==", true));
                return [4 /*yield*/, (0, firestore_1.getDocs)(iQuery)];
            case 1:
                certs = _a.sent();
                res = [];
                certs.forEach(function (cert) {
                    res.push(__assign(__assign({}, cert.data()), { id: cert.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getRevokedByOrg = getRevokedByOrg;
var uploadCertificateBuffertoStorage = function (buffer, storageRef) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var storage = (0, storage_1.getStorage)();
                var cRef = (0, storage_1.ref)(storage, storageRef);
                (0, storage_1.uploadBytes)(cRef, buffer)
                    .then(function () {
                    resolve(storageRef);
                })
                    .catch(function (err) {
                    reject(err);
                });
            })];
    });
}); };
exports.uploadCertificateBuffertoStorage = uploadCertificateBuffertoStorage;
