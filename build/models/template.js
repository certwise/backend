"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isItems = exports.isItem = exports.isCanvas = exports.isTemplate = void 0;
function isTemplate(template) {
    var bool = template.name !== undefined &&
        template.uid !== undefined &&
        template.description !== undefined &&
        template.createdAt !== undefined &&
        template.updatedAt !== undefined &&
        template.numberOfCertificates !== undefined &&
        template.name !== null &&
        template.uid !== null &&
        template.description !== null &&
        template.createdAt !== null &&
        template.updatedAt !== null &&
        template.numberOfCertificates !== null &&
        isCanvas(template.canvas);
    if (!bool)
        console.log("Invalid template (isTemp func in models)");
    return bool;
}
exports.isTemplate = isTemplate;
function isCanvas(canvas) {
    var bool = canvas.exportCanvasAs !== undefined &&
        canvas.height !== undefined &&
        canvas.width !== undefined &&
        canvas.exportCanvasAs !== null &&
        canvas.height !== null &&
        canvas.width !== null &&
        isItems(canvas.items);
    if (!bool)
        console.log("Invalid canvas");
    return bool;
}
exports.isCanvas = isCanvas;
function isItem(item) {
    var bool = item.type !== undefined &&
        item.id !== undefined &&
        item.name !== undefined &&
        item.height !== undefined &&
        item.width !== undefined &&
        item.x !== undefined &&
        item.y !== undefined &&
        item.opacity !== undefined &&
        item.rotation !== undefined &&
        item.isConstant !== undefined &&
        item.type !== null &&
        item.id !== null &&
        item.name !== null &&
        item.height !== null &&
        item.width !== null &&
        item.x !== null &&
        item.y !== null &&
        item.opacity !== null &&
        item.rotation !== null &&
        item.isConstant !== null;
    if (!bool)
        console.log("Invalid item");
    return bool;
}
exports.isItem = isItem;
function isItems(items) {
    var bool = items.every(function (item) { return isItem(item); });
    if (!bool)
        console.log("Invalid items");
    return bool;
}
exports.isItems = isItems;
