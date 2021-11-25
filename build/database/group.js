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
exports.deleteGroup = exports.update = exports.getByOrganization = exports.getOne = exports.create = void 0;
var firestore_1 = require("firebase/firestore");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var db = (0, firestore_1.getFirestore)();
var groupsCollection = (0, firestore_1.collection)(db, "groups");
var create = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var groupRef, orgRef, orgDoc, orgRes, org;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.addDoc)(groupsCollection, group)];
            case 1:
                groupRef = _a.sent();
                orgRef = (0, firestore_1.collection)(db, "organizations");
                orgDoc = (0, firestore_1.doc)(orgRef, group.organization);
                return [4 /*yield*/, (0, firestore_1.getDoc)(orgDoc)];
            case 2:
                orgRes = _a.sent();
                org = orgRes.data();
                if (org.groups)
                    org.groups.push(groupRef.id);
                else
                    org.groups = [groupRef.id];
                return [4 /*yield*/, (0, firestore_1.setDoc)(orgDoc, org)];
            case 3:
                _a.sent();
                return [2 /*return*/, __assign({ id: groupRef.id }, group)];
        }
    });
}); };
exports.create = create;
var getOne = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupRef, groupRes, group;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupRef = (0, firestore_1.doc)(groupsCollection, groupId);
                return [4 /*yield*/, (0, firestore_1.getDoc)(groupRef)];
            case 1:
                groupRes = _a.sent();
                group = __assign({ id: groupId }, groupRes.data());
                return [2 /*return*/, group];
        }
    });
}); };
exports.getOne = getOne;
var getByOrganization = function (organization) { return __awaiter(void 0, void 0, void 0, function () {
    var gQuery, groups, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gQuery = (0, firestore_1.query)(groupsCollection, (0, firestore_1.where)("organization", "==", organization));
                return [4 /*yield*/, (0, firestore_1.getDocs)(gQuery)];
            case 1:
                groups = _a.sent();
                res = [];
                groups.forEach(function (group) {
                    res.push(__assign(__assign({}, group.data()), { id: group.id }));
                });
                return [2 /*return*/, res];
        }
    });
}); };
exports.getByOrganization = getByOrganization;
var update = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var groupRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupRef = (0, firestore_1.doc)(groupsCollection, group.id);
                return [4 /*yield*/, (0, firestore_1.setDoc)(groupRef, group)];
            case 1:
                _a.sent();
                return [2 /*return*/, group];
        }
    });
}); };
exports.update = update;
var deleteGroup = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupRef = (0, firestore_1.doc)(groupsCollection, groupId);
                return [4 /*yield*/, (0, firestore_1.deleteDoc)(groupRef)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteGroup = deleteGroup;
