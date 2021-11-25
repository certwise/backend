"use strict";
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
exports.replaceFieldsWithValue = exports.getFieldsFromString = exports.makeid = exports.getTemplateFields = exports.getTemplateImage = exports.getAllFontsFromTemplate = exports.getLoadedText = exports.getLoadedImage = void 0;
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
var fs_1 = __importDefault(require("fs"));
var config_1 = __importDefault(require("../../config"));
var cmj_1 = __importDefault(require("konva/cmj"));
var canvas_1 = __importDefault(require("canvas"));
var axios_1 = __importDefault(require("axios"));
/***
 * Get template object from firestore with given **templateId**
 */
var getTemplate = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var db, template;
    return __generator(this, function (_a) {
        db = (0, firestore_1.getFirestore)(config_1.default.firebaseApp);
        template = (0, firestore_1.doc)(db, "templates", templateId);
        console.log("Getting template " + templateId);
        return [2 /*return*/, (0, firestore_1.getDoc)(template)];
    });
}); };
/***
 * pass in imageItem and get the konva Image object that can be added to a layer
 */
var getLoadedImage = function (item) {
    return new Promise(function (resolve, reject) {
        if (item.storageRef) {
            console.log(item.storageRef);
            (0, storage_1.getDownloadURL)((0, storage_1.ref)((0, storage_1.getStorage)(), item.storageRef))
                .then(function (url) {
                cmj_1.default.Image.fromURL(url, function (image) {
                    image.x(item.x);
                    image.y(item.y);
                    image.width(item.width);
                    image.height(item.height);
                    image.opacity(item.opacity || 1);
                    image.rotation(item.rotation || 0);
                    resolve(image);
                    return image;
                });
            })
                .catch(function (err) {
                console.log(err);
                reject(err);
            });
        }
        else {
            resolve(new cmj_1.default.Image({ image: undefined }));
        }
    });
};
exports.getLoadedImage = getLoadedImage;
/***
 * pass in textItem and get the konva Text object that can be added to a layer
 */
var getLoadedText = function (item, fields) {
    var textValue = (0, exports.replaceFieldsWithValue)(item.text, fields);
    return new Promise(function (resolve) {
        console.log("getLoadedText()");
        var text = new cmj_1.default.Text({
            x: item.x,
            y: item.y,
            height: item.height,
            width: item.width,
            text: textValue,
            fontSize: item.fontSize,
            fontFamily: item.fontFamily,
            align: item.horizontalAlign || "center",
            fill: item.fill,
            id: item.id,
            rotation: item.rotation || 0,
            opacity: item.opacity || 1,
        });
        if (text.attrs.text !== text.textArr[0].text) {
            while (text.attrs.text !== text.textArr[0].text) {
                text.setAttr("fontSize", text.attrs.fontSize - 1);
                console.log("Reducing fontSize to:", text.attrs.fontSize);
            }
        }
        console.log(text);
        resolve(text);
    });
};
exports.getLoadedText = getLoadedText;
var getAllFontsFromTemplate = function (template, pathDir) {
    console.log("Getting fonts from templatesss");
    var promises = [];
    for (var i in template.canvas.items) {
        var item = template.canvas.items[i];
        if (item.type === "text") {
            if (item.fontFileLink) {
                var fileLink = item.fontFileLink;
                var fontFamily = item.fontFamily;
                if (fs_1.default.existsSync(pathDir + "/" + fontFamily.replace(/ /g, "-") + ".ttf")) {
                    console.log(fontFamily + " already exists");
                    promises.push(getExistingFonts(pathDir + "/" + fontFamily.replace(/ /g, "-") + ".ttf", fontFamily));
                }
                else {
                    //fs.mkdirSync(pathDir, { recursive: true })
                    console.log("Pushing to promises");
                    var promise = downloadFontFile(fileLink, pathDir + "/" + fontFamily.replace(/ /g, "-") + ".ttf", fontFamily);
                    promises.push(promise);
                    console.log("Pushed to promises");
                }
            }
        }
    }
    console.log("Promises: " + promises);
    return Promise.all(promises);
};
exports.getAllFontsFromTemplate = getAllFontsFromTemplate;
var getExistingFonts = function (path, family) {
    return new Promise(function (resolve) { return resolve({ path: path, family: family }); });
};
/***
 * returns a promise that returns value with { path: outputLocationPath, family:family }
 */
var downloadFontFile = function (fileUrl, outputLocationPath, family) {
    console.log("Downloading " + fileUrl + " to " + outputLocationPath);
    return new Promise(function (resolve, reject) {
        var writer = fs_1.default.createWriteStream(outputLocationPath);
        (0, axios_1.default)({
            method: "get",
            url: fileUrl,
            responseType: "stream",
        })
            .then(function (response) {
            response.data.pipe(writer);
            var error = null;
            writer.on("error", function (err) {
                error = err;
                writer.close();
                reject("Error in saving font to storage");
            });
            writer.on("close", function () {
                if (!error) {
                    resolve({ path: outputLocationPath, family: family });
                    console.log("Resolved font object from downloadFontFile");
                }
            });
        })
            .catch(function (err) {
            console.log(err);
            reject("Error in downloading font");
        });
    });
};
var getTemplateImage = function (templateId, fields) {
    return new Promise(function (resolve, reject) {
        var template;
        var pathDir = "./storage/fonts/";
        getTemplate(templateId)
            .then(function (temp) {
            template = temp.data();
            return (0, exports.getAllFontsFromTemplate)(template, pathDir);
        })
            .then(function (fontsObj) {
            console.log("fonts loaded to storage");
            fontsObj.forEach(function (obj) {
                canvas_1.default.registerFont(obj.path, { family: obj.family });
            });
            var promises = [];
            template.canvas.items.map(function (item) {
                console.log(item.type);
                if (item.type === "text") {
                    promises.push((0, exports.getLoadedText)(item, fields));
                }
                if (item.type === "image") {
                    promises.push((0, exports.getLoadedImage)(item));
                }
            });
            return Promise.all(promises);
        })
            .then(function (items) {
            var stage = new cmj_1.default.Stage({
                container: undefined,
            });
            var layer = new cmj_1.default.Layer();
            var rect = new cmj_1.default.Rect({
                x: 0,
                y: 0,
                height: template.canvas.height,
                width: template.canvas.width,
                fill: "white",
            });
            layer.add(rect);
            stage.x(0);
            stage.y(0);
            stage.height(template.canvas.height);
            stage.width(template.canvas.width);
            stage.scaleX(1);
            stage.scaleY(1);
            stage.add(layer);
            items.forEach(function (item) { return layer.add(item); });
            var img = stage.toDataURL({
                pixelRatio: 1.5,
                mimeType: "image/jpeg",
            });
            console.log("Items loaded into Konva layer by toDataURL()");
            var data = img.replace(/^data:image\/\w+;base64,/, "");
            // eslint-disable-next-line no-undef
            var buffer = Buffer.from(data, "base64");
            console.log("pathDir: " + pathDir);
            resolve(buffer);
        })
            .catch(function (err) {
            console.log(err);
            reject(err);
        });
    });
};
exports.getTemplateImage = getTemplateImage;
var getTemplateFields = function (templateId) {
    console.log("getTemplateFields()");
    return new Promise(function (resolve, reject) {
        getTemplate(templateId)
            .then(function (template) {
            console.log(template.data());
            var data = template.data();
            console.log("Data:", Object.keys(data));
            var fields = [];
            data.canvas.items.forEach(function (item) {
                if (item.type === "text") {
                    if (!item.isConstant)
                        fields.push(item.name);
                }
            });
            console.log(fields);
            resolve(fields);
        })
            .catch(function (err) {
            reject(err);
            console.log(err);
        });
    });
};
exports.getTemplateFields = getTemplateFields;
var makeid = function (length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.makeid = makeid;
var getFieldsFromString = function (string) {
    var results = [];
    var re = /{{([^}]+)}}/g;
    var text;
    while ((text = re.exec(string))) {
        results.push(text[1]);
    }
    return results;
};
exports.getFieldsFromString = getFieldsFromString;
var replaceFieldsWithValue = function (string, fields) {
    var result = string;
    fields.forEach(function (field) {
        if (field.value)
            result = result.replace("{{ " + field + " }}", field.value);
    });
    return result;
};
exports.replaceFieldsWithValue = replaceFieldsWithValue;
