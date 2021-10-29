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
exports.bulkDeleteCertificates_ = exports.deleteCertificate_ = exports.bulkUpdateCertificates_ = exports.updateCertificate_ = exports.bulkCreateCertificates_ = exports.getCertificatesByTemplate_ = exports.createSingleCertificate_ = exports.getAllCertificatesByUID_ = exports.getCertificate_ = void 0;
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
var fs_1 = __importDefault(require("fs"));
var helperFunctions_1 = require("../template/helperFunctions");
var getCertificate_ = function () {
    return null;
};
exports.getCertificate_ = getCertificate_;
var getAllCertificatesByUID_ = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, docs, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                result = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "certificates"), (0, firestore_1.where)("issuerId", "==", uid)))];
            case 2:
                docs = _a.sent();
                docs.forEach(function (doc) {
                    var x = __assign({ id: doc.id.toString() }, doc.data());
                    result.push(x);
                });
                return [2 /*return*/, result];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllCertificatesByUID_ = getAllCertificatesByUID_;
var createSingleCertificate_ = function (cert) {
    var templateId = cert.templateId.replace(/\s/g, "");
    var fields = cert.fields;
    var certificateName = cert.recipient.name + "_" + (0, helperFunctions_1.makeid)(12) + ".jpg";
    var certificateRef = cert.issuerId + "/certificates/" + certificateName;
    return new Promise(function (resolve) {
        (0, helperFunctions_1.getTemplateImage)(templateId, fields)
            .then(function (buffer) {
            console.log("Buffer created");
            fs_1.default.writeFileSync("./storage/" + certificateName + ".jpg", buffer);
            var file = fs_1.default.readFileSync("./storage/" + certificateName + ".jpg");
            return (0, storage_1.uploadBytes)((0, storage_1.ref)((0, storage_1.getStorage)(), certificateRef), file);
        })
            .then(function () {
            console.log("File uploaded");
            var db = (0, firestore_1.getFirestore)();
            var certificate = __assign(__assign({}, cert), { storageRef: certificateRef });
            return (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "certificates"), certificate);
        })
            .then(function () {
            console.log("Document added to firestore");
            fs_1.default.unlinkSync("./storage/" + certificateName + ".jpg");
            var db = (0, firestore_1.getFirestore)();
            return (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "templates", templateId));
        })
            .then(function (t) {
            var template = __assign({}, t.data());
            if (template["numberOfCertificates"] > 0)
                template["numberOfCertificates"]++;
            else
                template["numberOfCertificates"] = 1;
            var db = (0, firestore_1.getFirestore)();
            return (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "templates", templateId), template);
        })
            .then(function () { return resolve(true); })
            .catch(function () {
            resolve(false);
        });
    });
};
exports.createSingleCertificate_ = createSingleCertificate_;
var getCertificatesByTemplate_ = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, docs, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                result = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "certificates"), (0, firestore_1.where)("templateID", "==", templateId)))];
            case 2:
                docs = _a.sent();
                docs.forEach(function (doc) {
                    result.push(__assign({ id: doc.id }, doc.data()));
                });
                return [2 /*return*/, result];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCertificatesByTemplate_ = getCertificatesByTemplate_;
var bulkCreateCertificates_ = function () {
    return null;
};
exports.bulkCreateCertificates_ = bulkCreateCertificates_;
var updateCertificate_ = function () {
    return null;
};
exports.updateCertificate_ = updateCertificate_;
var bulkUpdateCertificates_ = function () {
    return null;
};
exports.bulkUpdateCertificates_ = bulkUpdateCertificates_;
var deleteCertificate_ = function () {
    return null;
};
exports.deleteCertificate_ = deleteCertificate_;
var bulkDeleteCertificates_ = function () {
    return null;
};
exports.bulkDeleteCertificates_ = bulkDeleteCertificates_;
