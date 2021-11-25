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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.issue = exports.update = exports.getByGroup = exports.getByTemplate = exports.getByOrganizaion = exports.getOne = exports.createOne = void 0;
var certificate_1 = require("../models/certificate");
var db = __importStar(require("../database/certificate"));
var functions_1 = require("../models/template/functions");
var dotenv_1 = __importDefault(require("dotenv"));
var recipient_1 = require("../database/recipient");
var organization_1 = require("../database/organization");
// These comments are to ignore ts and es-lint warnings as mailersend ts package is not available
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var mailersend_1 = __importStar(require("mailersend"));
dotenv_1.default.config();
var mailersend = new mailersend_1.default({
    api_key: process.env.MAILERSEND_API_KEY,
});
var createOne = function (req, res) {
    var certificate = new certificate_1.Certificate(req.body);
    var isValid = certificate.validate();
    if (!isValid.error) {
        certificate
            .create(db.create, functions_1.getTemplateImage, db.uploadCertificateBuffertoStorage)
            .then(function (certificate) {
            res.status(200).send(__assign({}, certificate));
        })
            .catch(function (err) {
            console.log(err);
            res.status(400).send(err.toString());
        });
    }
    else {
        res.status(400).send("Error:" + isValid.message);
    }
};
exports.createOne = createOne;
var getOne = function (req, res) {
    var certificateId = req.params.certificateId;
    certificate_1.Certificate.getOne(certificateId, db.getOne)
        .then(function (certificate) {
        res.status(200).send(certificate);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
};
exports.getOne = getOne;
var getByOrganizaion = function (req, res) {
    var org = req.params.organization;
    certificate_1.Certificate.getByOrganizaion(org, db.getByOrganization)
        .then(function (certificates) {
        res.status(200).send(certificates);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
};
exports.getByOrganizaion = getByOrganizaion;
var getByTemplate = function (req, res) {
    var templateId = req.params.templateId;
    certificate_1.Certificate.getByTemplate(templateId, db.getByTemplate)
        .then(function (certificates) {
        res.status(200).send(certificates);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
};
exports.getByTemplate = getByTemplate;
var getByGroup = function (req, res) {
    var groupId = req.params.groupId;
    certificate_1.Certificate.getByGroup(groupId, db.getByGroup)
        .then(function (certificates) {
        res.status(200).send(certificates);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
};
exports.getByGroup = getByGroup;
var update = function (req, res) {
    var certificate = new certificate_1.Certificate(req.body);
    var isValid = certificate.validate();
    if (!isValid.error) {
        certificate
            .update(db.update)
            .then(function (certificate) {
            res.status(200).send(certificate);
        })
            .catch(function (err) {
            res.status(500).send(err);
        });
    }
    else {
        res.status(400).send("Invalid request body. " + isValid.message);
    }
};
exports.update = update;
var issue = function (req, res) {
    var certificateId = req.params.certificate;
    certificate_1.Certificate.getOne(certificateId, db.getOne)
        .then(function (certificate) {
        new certificate_1.Certificate(certificate).issue(db.update, sendEmail);
        res.status(200).send(certificate);
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.issue = issue;
var sendEmail = function (recipient_, templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var recipient, organization;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, recipient_1.get)(recipient_)];
            case 1:
                recipient = _a.sent();
                return [4 /*yield*/, (0, organization_1.get)(recipient.organization)];
            case 2:
                organization = _a.sent();
                console.log(recipient, templateId);
                return [2 /*return*/, new Promise(function (resolve) {
                        var issuerName = organization.name;
                        var email = recipient.email;
                        var receiverName = recipient.name; // dummy values for now
                        var recipients = [new mailersend_1.Recipient(email, receiverName)];
                        var personalization = [
                            {
                                email: email,
                                data: {
                                    name: receiverName,
                                    issuer: {
                                        name: issuerName,
                                    },
                                    credential: {
                                        link: "https://certwise.app",
                                        reason: "Certificate",
                                    },
                                },
                            },
                        ];
                        var emailParams = new mailersend_1.EmailParams()
                            .setFrom("credential_noreply@notify.certwise.app")
                            .setFromName("Certwise")
                            .setRecipients(recipients)
                            .setSubject("Certwise Digital Credential")
                            .setTemplateId("pr9084z2j84w63dn")
                            .setPersonalization(personalization);
                        mailersend.send(emailParams);
                        resolve();
                    })];
        }
    });
}); };
