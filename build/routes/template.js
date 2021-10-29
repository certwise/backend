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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controller = __importStar(require("../controllers/template"));
var router = express_1.default.Router();
router.post("/", controller.createTemplate);
router.post("/canvas/item/addImage", controller.addImageToCanvas);
router.get("/fields/:templateId", controller.getFields);
router.get("/one/:templateId", controller.getTemplateById);
router.get("/uid/:uid", controller.getTemplatesByUid);
router.get("/numberOfCertificates/:templateId", controller.getNumberOfCertificates);
router.get("/name-uid", controller.getTemplateByNameAndUid);
router.get("/names/:uid", controller.getTemplateNamesByUid);
router.put("/update/:templateId", controller.updateTemplate);
router.put("/rename", controller.renameTemplate);
router.delete("/:templateId", controller.deleteTemplate);
exports.default = router;
