"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var monk_1 = __importDefault(require("monk"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var db = (0, monk_1.default)(process.env.MONGO_URI);
exports.default = db;
