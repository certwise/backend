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
exports.isTemplate = exports.Template = exports.templateSchema = void 0;
var joi_1 = __importDefault(require("joi"));
var imageSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    type: joi_1.default.string().valid("image", "text").required(),
    x: joi_1.default.number().required(),
    y: joi_1.default.number().required(),
    height: joi_1.default.number().required(),
    width: joi_1.default.number().required(),
    opacity: joi_1.default.number().required(),
    rotation: joi_1.default.number().required(),
    flipX: joi_1.default.boolean().required(),
    flipY: joi_1.default.boolean().required(),
    draggable: joi_1.default.boolean().required(),
    storageRef: joi_1.default.string().required(),
    originalHeight: joi_1.default.number().required(),
    originalWidth: joi_1.default.number().required(),
});
var textSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    type: joi_1.default.string().valid("text").required(),
    x: joi_1.default.number().required(),
    y: joi_1.default.number().required(),
    height: joi_1.default.number().required(),
    width: joi_1.default.number().required(),
    opacity: joi_1.default.number().required(),
    rotation: joi_1.default.number().required(),
    flipX: joi_1.default.boolean().required(),
    flipY: joi_1.default.boolean().required(),
    draggable: joi_1.default.boolean().required(),
    isConstant: joi_1.default.boolean().required(),
    text: joi_1.default.string().required(),
    fontSize: joi_1.default.number().required(),
    fontFamily: joi_1.default.string().required(),
    horizontalAlign: joi_1.default.string().valid("center", "left", "right").required(),
    verticalAlign: joi_1.default.string().valid("top", "middle", "bottom").required(),
    fontStyle: joi_1.default.string().required(),
    textDecoration: joi_1.default.string().required(),
    fontFileLink: joi_1.default.string().required(),
    fontFileName: joi_1.default.string().required(),
    fontDisplaySize: joi_1.default.number().required(),
    underline: joi_1.default.boolean().required(),
    italic: joi_1.default.boolean().required(),
    weight: joi_1.default.number().required(),
    fill: joi_1.default.string().required(),
});
// TODO add itemSchema to canvas items
var itemSchema = joi_1.default.object().valid(imageSchema, textSchema);
var canvasSchema = joi_1.default.object().keys({
    exportCanvasAs: joi_1.default.string().valid("jpg", "png").required(),
    height: joi_1.default.number().required(),
    width: joi_1.default.number().required(),
    items: joi_1.default.array().items(joi_1.default.any()).required(),
});
exports.templateSchema = joi_1.default.object().keys({
    _id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required(),
    updatedAt: joi_1.default.date().required(),
    canvas: canvasSchema,
    numberOfCertificates: joi_1.default.number().required(),
    imageRef: joi_1.default.string().required().allow(""),
    mailTemplate: joi_1.default.object().keys({
        from: joi_1.default.string().required().allow(""),
        to: joi_1.default.string().required().allow(""),
        subject: joi_1.default.string().required().allow(""),
        cc: joi_1.default.string().required().allow(""),
        message: joi_1.default.string().required().allow(""),
    }),
    createdBy: joi_1.default.string().required(),
    organization: joi_1.default.string().required(),
    templateFields: joi_1.default.array().items(joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        type: joi_1.default.string().valid("text", "image").required(),
        value: joi_1.default.string().optional(),
    })),
    isArchived: joi_1.default.boolean().required(),
});
var Template = /** @class */ (function () {
    function Template(template) {
        if (template._id)
            this._id = template._id;
        this.name = template.name;
        this.description = template.description;
        this.createdAt = template.createdAt;
        this.updatedAt = template.updatedAt;
        this.canvas = template.canvas;
        this.numberOfCertificates = template.numberOfCertificates;
        this.imageRef = template.imageRef;
        this.createdBy = template.createdBy;
        this.organization = template.organization;
        this.templateFields = template.templateFields;
        this.isArchived = template.isArchived;
        this.mailTemplate = template.mailTemplate;
    }
    Template.prototype.validate = function () {
        var error = exports.templateSchema.validate(this).error;
        if (error) {
            var message_1 = "";
            error.details.forEach(function (detail) {
                message_1 += "".concat(detail.message, " ...");
            });
            return {
                error: true,
                message: message_1,
            };
        }
        else {
            return {
                error: false,
                message: "",
            };
        }
    };
    Template.prototype.create = function (dbCreateTemplate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbCreateTemplate(__assign({}, _this))
                .then(function (template) {
                resolve(template);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.getOne = function (templateId, dbGetOneTemplate) {
        return new Promise(function (resolve, reject) {
            dbGetOneTemplate(templateId)
                .then(function (template) {
                resolve(template);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.getByOrganization = function (organizationId, dbGetByOrganization) {
        return new Promise(function (resolve, reject) {
            dbGetByOrganization(organizationId)
                .then(function (templates) {
                resolve(templates);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.prototype.update = function (dbUpdate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dbUpdate(__assign({}, _this))
                .then(function (template) {
                resolve(template);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.delete = function (templateId, dbDelete) {
        return new Promise(function (resolve, reject) {
            dbDelete(templateId)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.prototype.rename = function (name, dbUpdate) {
        var data = __assign({}, this);
        data.name = name;
        return new Promise(function (resolve, reject) {
            dbUpdate(data)
                .then(function (template) {
                resolve(template);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.prototype.replaceFieldsWithValues = function (fields) {
        var data = __assign({}, this);
        data.templateFields = fields;
        return data;
    };
    Template.prototype.getTemplateImageWithValues = function (fields, getImageFromTemplate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            getImageFromTemplate(__assign({}, _this), fields)
                .then(function (image) {
                resolve(image);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Template.prototype.getAllFields = function () {
        var result = [];
        for (var i = 0; i < this.canvas.items.length; i++) {
            var item = this.canvas.items[i];
            if (item.type === "text") {
                var fields = getFieldsFromString(item.text);
                var _loop_1 = function (j) {
                    var field = fields[j];
                    if (!result.find(function (x) { return x.name === field; }))
                        result.push({ name: field, type: "text", value: "" });
                };
                for (var j = 0; j < fields.length; j++) {
                    _loop_1(j);
                }
            }
        }
        return result;
    };
    return Template;
}());
exports.Template = Template;
var isTemplate = function (x) {
    return true;
};
exports.isTemplate = isTemplate;
var getFieldsFromString = function (string) {
    var results = [];
    var re = /{{([^}]+)}}/g;
    var text;
    while ((text = re.exec(string))) {
        results.push(text[1]);
    }
    return results;
};
