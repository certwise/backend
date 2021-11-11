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
exports.updateGroup_ = exports.createGroup_ = exports.getGroups_ = exports.getGroup_ = void 0;
var firestore_1 = require("firebase/firestore");
var db = (0, firestore_1.getFirestore)();
var getGroup_ = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var group, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.collection)(db, "groups"), id))];
            case 1:
                group = _a.sent();
                return [2 /*return*/, __assign(__assign({}, group.data()), { id: group.id })];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGroup_ = getGroup_;
var getGroups_ = function (institutionId) { return __awaiter(void 0, void 0, void 0, function () {
    var group, groups_1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "groups"))];
            case 1:
                group = _a.sent();
                groups_1 = [];
                group.forEach(function (g) {
                    if (g.data().institution === institutionId)
                        groups_1.push(__assign(__assign({}, g.data()), { id: g.id }));
                });
                return [2 /*return*/, groups_1];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGroups_ = getGroups_;
var createGroup_ = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var uDoc, doc_1, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uDoc = (0, firestore_1.collection)(db, "groups");
                return [4 /*yield*/, (0, firestore_1.addDoc)(uDoc, group)];
            case 1:
                doc_1 = _a.sent();
                return [2 /*return*/, doc_1.id];
            case 2:
                e_3 = _a.sent();
                console.log(e_3);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createGroup_ = createGroup_;
var updateGroup_ = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var uDoc, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uDoc = (0, firestore_1.doc)((0, firestore_1.collection)(db, "groups"), group.id);
                return [4 /*yield*/, (0, firestore_1.setDoc)(uDoc, group, { merge: true })];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                e_4 = _a.sent();
                console.log(e_4);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateGroup_ = updateGroup_;
