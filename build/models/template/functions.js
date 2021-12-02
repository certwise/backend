"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceFieldsWithValue = exports.getFieldsFromString = exports.makeid = exports.getTemplateFields = exports.getTemplateImage = exports.getAllFontsFromTemplate = exports.getLoadedText = exports.getLoadedImage = void 0;
var storage_1 = require("firebase/storage");
var fs_1 = __importDefault(require("fs"));
var cmj_1 = __importDefault(require("konva/cmj"));
var canvas_1 = __importDefault(require("canvas"));
var axios_1 = __importDefault(require("axios"));
var template_1 = require("../../database/template");
/***
 * Get template object from firestore with given **templateId**
 */
// const getTemplate = async (templateId: string) => {
// 	const db = getFirestore(env.firebaseApp);
// 	const template = doc(db, "templates", templateId);
// 	console.log(`Getting template ${templateId}`);
// 	return getDoc(template);
// };
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
    console.log("Text value is ".concat(textValue, ", ").concat(fields));
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
                if (fs_1.default.existsSync("".concat(pathDir, "/").concat(fontFamily.replace(/ /g, "-"), ".ttf"))) {
                    console.log("".concat(fontFamily, " already exists"));
                    promises.push(getExistingFonts("".concat(pathDir, "/").concat(fontFamily.replace(/ /g, "-"), ".ttf"), fontFamily));
                }
                else {
                    //fs.mkdirSync(pathDir, { recursive: true })
                    console.log("Pushing to promises");
                    var promise = downloadFontFile(fileLink, "".concat(pathDir, "/").concat(fontFamily.replace(/ /g, "-"), ".ttf"), fontFamily);
                    promises.push(promise);
                    console.log("Pushed to promises");
                }
            }
        }
    }
    console.log("Promises: ".concat(promises));
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
    console.log("Downloading ".concat(fileUrl, " to ").concat(outputLocationPath));
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
        var pathDir = "./storage/fonts";
        (0, template_1.getOne)(templateId)
            .then(function (templateRes) {
            template = templateRes;
            return (0, exports.getAllFontsFromTemplate)(template, pathDir);
        })
            .then(function (fontsObj) {
            console.log("fonts loaded to storage");
            fontsObj.forEach(function (obj) {
                console.log(obj);
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
            console.log("pathDir: ".concat(pathDir));
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
        (0, template_1.getOne)(templateId)
            .then(function (data) {
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
        console.log("Replacing text", field.name, "with", field.value);
        if (field.value)
            result = result.replace("{{ ".concat(field.name.replace(/ /g, ""), " }}"), field.value);
    });
    return result;
};
exports.replaceFieldsWithValue = replaceFieldsWithValue;
