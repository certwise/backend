"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByGroup = exports.getByOrganization = exports.deleteRecipient = exports.update = exports.get = exports.createBulk = exports.create = void 0;
var recipient_1 = require("../models/recipient");
var db = __importStar(require("../database/recipient"));
var create = function (req, res) {
    var recipient = new recipient_1.Recipient(req.body);
    var isValid = recipient.validate();
    if (!isValid.error) {
        recipient
            .create(db.create)
            .then(function (recipient) {
            res.status(200).send(recipient);
        })
            .catch(function (err) {
            console.log(err);
            res.status(500).send(err.toString());
        });
    }
    else {
        res.status(400).send(isValid.message);
    }
};
exports.create = create;
var createBulk = function (req, res) {
    var recipients = req.body;
    var isValid = { error: false, message: "" };
    for (var _i = 0, recipients_1 = recipients; _i < recipients_1.length; _i++) {
        var r = recipients_1[_i];
        var recipient = new recipient_1.Recipient(r);
        var isValid_ = recipient.validate();
        if (isValid_.error) {
            isValid.error = true;
            isValid.message += isValid_.message;
            break;
        }
        else
            continue;
    }
    if (!isValid.error) {
        recipient_1.Recipient.createBulk(recipients, db.createBulk)
            .then(function (recipients) {
            res.status(200).send(recipients);
        })
            .catch(function (err) {
            console.log(err);
            res.status(500).send(err.toString());
        });
    }
    else {
        res.status(400).send(isValid.message);
    }
};
exports.createBulk = createBulk;
var get = function (req, res) {
    recipient_1.Recipient.get(req.params.recipient, db.get)
        .then(function (recipient) {
        res.status(200).send(recipient);
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).send(err.message);
    });
};
exports.get = get;
var update = function (req, res) {
    var recipient = new recipient_1.Recipient(req.body);
    var isValid = recipient.validate();
    if (!isValid.error) {
        recipient
            .update(db.update)
            .then(function (recipient) {
            res.status(200).send(recipient);
        })
            .catch(function (err) {
            res.status(500).send(err.message);
        });
    }
    else {
        res.status(400).send(isValid.message);
    }
};
exports.update = update;
var deleteRecipient = function (req, res) {
    res.send("Recipient test");
};
exports.deleteRecipient = deleteRecipient;
var getByOrganization = function (req, res) {
    recipient_1.Recipient.getByOrganization(req.params.organization, db.getByOrganizaion)
        .then(function (recipient) {
        res.status(200).send(recipient);
    })
        .catch(function (err) {
        res.status(500).send(err.message);
    });
};
exports.getByOrganization = getByOrganization;
var getByGroup = function (req, res) {
    recipient_1.Recipient.getByGroup(req.params.group, db.getByGroup)
        .then(function (recipient) {
        res.status(200).send(recipient);
    })
        .catch(function (err) {
        res.status(500).send(err.message);
    });
};
exports.getByGroup = getByGroup;
