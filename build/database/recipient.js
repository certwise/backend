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
exports.update = exports.getByGroup = exports.getByOrganization = exports.get = exports.create = void 0;
var firestore_1 = require("firebase/firestore");
var db = (0, firestore_1.getFirestore)();
var recipientCollection = (0, firestore_1.collection)(db, "recipients");
var create = function (recipient) { return __awaiter(void 0, void 0, void 0, function () {
    var checkRecipientQuery, checkRecipient, ref, orgDoc, orgRes, org;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                checkRecipientQuery = (0, firestore_1.query)(recipientCollection, (0, firestore_1.where)("email", "==", recipient.email), (0, firestore_1.where)("organization", "==", recipient.organization));
                return [4 /*yield*/, (0, firestore_1.getDocs)(checkRecipientQuery)];
            case 1:
                checkRecipient = _a.sent();
                if (!!checkRecipient.empty) return [3 /*break*/, 2];
                throw new Error("Recipient already exists in this organization.");
            case 2:
                console.log(recipient);
                return [4 /*yield*/, (0, firestore_1.addDoc)(recipientCollection, recipient)];
            case 3:
                ref = _a.sent();
                console.log("Recipient2", recipient);
                orgDoc = (0, firestore_1.doc)((0, firestore_1.collection)(db, "organizations"), recipient.organization);
                return [4 /*yield*/, (0, firestore_1.getDoc)(orgDoc)];
            case 4:
                orgRes = _a.sent();
                org = __assign({ id: orgRes.id }, orgRes.data());
                if (org.recipients)
                    org.recipients.push(ref.id);
                else
                    org.recipients = [ref.id];
                console.log("Adding recipient to organization.");
                return [4 /*yield*/, (0, firestore_1.setDoc)(orgDoc, org)];
            case 5:
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, recipient), { id: ref.id })];
        }
    });
}); };
exports.create = create;
var get = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = (0, firestore_1.doc)(recipientCollection, id);
                return [4 /*yield*/, (0, firestore_1.getDoc)(ref)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, __assign({ id: res.id }, res.data())];
        }
    });
}); };
exports.get = get;
var getByOrganization = function (organization) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = (0, firestore_1.query)(recipientCollection, (0, firestore_1.where)("organization", "==", organization));
                return [4 /*yield*/, (0, firestore_1.getDocs)(ref)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
        }
    });
}); };
exports.getByOrganization = getByOrganization;
var getByGroup = function (group) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = (0, firestore_1.query)(recipientCollection, (0, firestore_1.where)("groups", "array-contains", group));
                return [4 /*yield*/, (0, firestore_1.getDocs)(ref)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
        }
    });
}); };
exports.getByGroup = getByGroup;
var update = function (recipient) { return __awaiter(void 0, void 0, void 0, function () {
    var ref;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = (0, firestore_1.doc)(recipientCollection, recipient.id);
                return [4 /*yield*/, (0, firestore_1.setDoc)(ref, recipient)];
            case 1:
                _a.sent();
                return [2 /*return*/, recipient];
        }
    });
}); };
exports.update = update;
