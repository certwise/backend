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
exports.renameTemplate_ = exports.getTemplateByNameAndUid_ = exports.getTemplatesNamesByUid_ = exports.getNumberOfCertificatesInTemplate_ = exports.getFieldsFromTemplate_ = exports.updateItems_ = exports.updateTemplate_ = exports.deleteTemplate_ = exports.getTemplatesByUid_ = exports.getTemplateById_ = exports.createTemplate_ = void 0;
var template_1 = require("../../models/template");
var helperFunctions_1 = require("./helperFunctions");
var firestore_1 = require("firebase/firestore");
var createTemplate_ = function (template) { return __awaiter(void 0, void 0, void 0, function () {
    var db, docRef, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                if (!(0, template_1.isTemplate)(template)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "templates"), template)];
            case 2:
                docRef = _a.sent();
                console.log("Creating a new template for user: ", template.uid, "with name: ", template.name);
                console.log("Template:", template);
                return [2 /*return*/, "Template created successfully with id: " + docRef.id];
            case 3:
                err_1 = _a.sent();
                console.log("Error creating template - ", err_1);
                return [2 /*return*/, false];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.log("Template is not valid (in createTemplate_)");
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createTemplate_ = createTemplate_;
var getTemplateById_ = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var db, template, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "templates", id))];
            case 2:
                template = _a.sent();
                console.log("Getting template with id: ", id);
                if (template.data()) {
                    console.log("Template data: ", template.data());
                    return [2 /*return*/, __assign(__assign({}, template.data()), { id: template.id })];
                }
                else {
                    console.error("Template does not exist");
                    return [2 /*return*/, false];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("Error getting template by id - ", error_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTemplateById_ = getTemplateById_;
var getTemplatesByUid_ = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, templates, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                result = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "templates"), (0, firestore_1.where)("uid", "==", uid)))];
            case 2:
                templates = _a.sent();
                templates.forEach(function (res) {
                    result.push(__assign(__assign({}, res.data()), { id: res.id }));
                });
                console.log("Getting templates of user with uid :", uid);
                console.log("Result :", result);
                return [2 /*return*/, result];
            case 3:
                error_2 = _a.sent();
                console.log("Error getting templates by uid - ", error_2);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTemplatesByUid_ = getTemplatesByUid_;
var deleteTemplate_ = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var db, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Deleting template with id: ", id);
                return [4 /*yield*/, (0, firestore_1.deleteDoc)((0, firestore_1.doc)(db, "templates", id))];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                e_1 = _a.sent();
                console.log("Error deleting templates - ", e_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteTemplate_ = deleteTemplate_;
var updateTemplate_ = function (template) { return __awaiter(void 0, void 0, void 0, function () {
    var db, docRef, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                console.log("Updating");
                if (!((0, template_1.isTemplate)(template) && template.id !== undefined)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Updating template with id: ", template.id);
                docRef = (0, firestore_1.doc)(db, "templates", template.id.trim());
                return [4 /*yield*/, (0, firestore_1.setDoc)(docRef, template, {
                        merge: true,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                e_2 = _a.sent();
                console.log("Error updating templates - ", e_2);
                return [2 /*return*/, false];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.log("Template is not valid (in updateTemplate_)");
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateTemplate_ = updateTemplate_;
var updateItems_ = function (templateId, items) {
    return templateId + items;
};
exports.updateItems_ = updateItems_;
var getFieldsFromTemplate_ = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var fields, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Getting fields...");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, helperFunctions_1.getTemplateFields)(templateId.replace(/\s/g, ""))];
            case 2:
                fields = _a.sent();
                console.log("Fields:", fields);
                return [2 /*return*/, fields];
            case 3:
                err_2 = _a.sent();
                console.log("Error getting fields from templates - ", err_2);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getFieldsFromTemplate_ = getFieldsFromTemplate_;
var getNumberOfCertificatesInTemplate_ = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var db, docs, count_1, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "certificates"), (0, firestore_1.where)("templateId", "==", templateId)))];
            case 2:
                docs = _a.sent();
                count_1 = 0;
                docs.forEach(function () {
                    count_1++;
                });
                return [2 /*return*/, count_1];
            case 3:
                e_3 = _a.sent();
                console.log("Error getting number of certificates in templates - ", e_3);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getNumberOfCertificatesInTemplate_ = getNumberOfCertificatesInTemplate_;
var getTemplatesNamesByUid_ = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, res_1, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = (0, firestore_1.getFirestore)();
                console.log("Getting templates names by uid - ", uid);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "templates"), (0, firestore_1.where)("issuerId", "==", uid)))];
            case 2:
                result = _a.sent();
                res_1 = [];
                result.forEach(function (template) {
                    if (template.data().uid === uid) {
                        var name_1 = template.data().name;
                        res_1.push(name_1);
                    }
                });
                console.log(res_1);
                return [2 /*return*/, res_1];
            case 3:
                e_4 = _a.sent();
                console.log("Error getting templates names by uid - ", e_4);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTemplatesNamesByUid_ = getTemplatesNamesByUid_;
var getTemplateByNameAndUid_ = function (templateName, uid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Getting template by name and uid - ", templateName, uid);
        return [2 /*return*/, new Promise(function (resolve) {
                var db = (0, firestore_1.getFirestore)();
                (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(db, "templates"), (0, firestore_1.where)("uid", "==", uid))).then(function (results) {
                    results.forEach(function (template) {
                        if (template.data().name.toLowerCase().replace(/\s/g, "") ===
                            templateName) {
                            resolve(__assign(__assign({}, template.data()), { id: template.id }));
                        }
                    });
                });
            })];
    });
}); };
exports.getTemplateByNameAndUid_ = getTemplateByNameAndUid_;
var renameTemplate_ = function (id, name) { return __awaiter(void 0, void 0, void 0, function () {
    var db, templateRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Renaming template with id: ", id);
                db = (0, firestore_1.getFirestore)();
                templateRef = (0, firestore_1.doc)(db, "templates", id);
                return [4 /*yield*/, (0, firestore_1.setDoc)(templateRef, { name: name }, { merge: true })];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.renameTemplate_ = renameTemplate_;
