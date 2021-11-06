"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/:id");
router.get("/group/:groupid");
router.get("/uid/:uid");
router.post("/one");
router.post("/many");
router.put("/");
router.delete("/:id");
exports.default = router;
