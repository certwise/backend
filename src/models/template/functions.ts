import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import fs from "fs";
import env from "../../config";
import konva from "konva/cmj";
import canvas from "canvas";
import axios from "axios";
import { TemplateField, ITemplate, Text as text } from "../../models/template";
import { Image as image } from "../../models/template";
import { Image } from "konva/cmj/shapes/Image";
import { Text } from "konva/cmj/shapes/Text";

/***
 * Get template object from firestore with given **templateId**
 */
const getTemplate = async (templateId: string) => {
	const db = getFirestore(env.firebaseApp);
	const template = doc(db, "templates", templateId);
	console.log(`Getting template ${templateId}`);
	return getDoc(template);
};

/***
 * pass in imageItem and get the konva Image object that can be added to a layer
 */
export const getLoadedImage = (item: image): Promise<Image> => {
	return new Promise((resolve, reject) => {
		if (item.storageRef) {
			console.log(item.storageRef);
			getDownloadURL(ref(getStorage(), item.storageRef))
				.then((url) => {
					konva.Image.fromURL(url, (image: Image) => {
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
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		} else {
			resolve(new konva.Image({ image: undefined }));
		}
	});
};

/***
 * pass in textItem and get the konva Text object that can be added to a layer
 */
export const getLoadedText = (
	item: text,
	fields: TemplateField[]
): Promise<Text> => {
	const textValue = replaceFieldsWithValue(item.text, fields);
	return new Promise((resolve) => {
		console.log(`getLoadedText()`);
		const text = new konva.Text({
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

/***
 * returns a promise that returns array of values with { path: outputLocationPath, family:family }
 */
type fontPath = { path: string; family: string };
export const getAllFontsFromTemplate = (
	template: ITemplate,
	pathDir: string
) => {
	console.log("Getting fonts from templatesss");
	const promises: Promise<fontPath>[] = [];
	for (const i in template.canvas.items) {
		const item = template.canvas.items[i];
		if (item.type === "text") {
			if (item.fontFileLink) {
				const fileLink = item.fontFileLink;
				const fontFamily = item.fontFamily;
				if (fs.existsSync(`${pathDir}/${fontFamily.replace(/ /g, "-")}.ttf`)) {
					console.log(`${fontFamily} already exists`);
					promises.push(
						getExistingFonts(
							`${pathDir}/${fontFamily.replace(/ /g, "-")}.ttf`,
							fontFamily
						)
					);
				} else {
					//fs.mkdirSync(pathDir, { recursive: true })
					console.log("Pushing to promises");
					const promise: Promise<fontPath> = downloadFontFile(
						fileLink,
						`${pathDir}/${fontFamily.replace(/ /g, "-")}.ttf`,
						fontFamily
					);
					promises.push(promise);
					console.log("Pushed to promises");
				}
			}
		}
	}
	console.log(`Promises: ${promises}`);
	return Promise.all(promises);
};
const getExistingFonts = (path: string, family: string): Promise<fontPath> => {
	return new Promise((resolve) => resolve({ path: path, family: family }));
};

/***
 * returns a promise that returns value with { path: outputLocationPath, family:family }
 */
const downloadFontFile = (
	fileUrl: string,
	outputLocationPath: string,
	family: string
): Promise<fontPath> => {
	console.log(`Downloading ${fileUrl} to ${outputLocationPath}`);
	return new Promise((resolve, reject) => {
		const writer = fs.createWriteStream(outputLocationPath);
		axios({
			method: "get",
			url: fileUrl,
			responseType: "stream",
		})
			.then((response) => {
				response.data.pipe(writer);
				let error: unknown = null;
				writer.on("error", (err) => {
					error = err;
					writer.close();
					reject("Error in saving font to storage");
				});
				writer.on("close", () => {
					if (!error) {
						resolve({ path: outputLocationPath, family: family });
						console.log("Resolved font object from downloadFontFile");
					}
				});
			})
			.catch((err) => {
				console.log(err);
				reject("Error in downloading font");
			});
	});
};

export const getTemplateImage = (
	templateId: string,
	fields: TemplateField[]
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		let template: ITemplate;
		const pathDir = `./storage/fonts/`;
		getTemplate(templateId)
			.then((temp) => {
				template = temp.data() as ITemplate;
				return getAllFontsFromTemplate(template, pathDir);
			})
			.then((fontsObj) => {
				console.log("fonts loaded to storage");
				fontsObj.forEach((obj) => {
					canvas.registerFont(obj.path, { family: obj.family });
				});
				const promises: Promise<Text | Image>[] = [];
				template.canvas.items.map((item) => {
					console.log(item.type);
					if (item.type === "text") {
						promises.push(getLoadedText(item, fields));
					}
					if (item.type === "image") {
						promises.push(getLoadedImage(item));
					}
				});
				return Promise.all(promises);
			})
			.then((items) => {
				const stage = new konva.Stage({
					container: undefined as unknown as string,
				});
				const layer = new konva.Layer();
				const rect = new konva.Rect({
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
				items.forEach((item) => layer.add(item));
				const img = stage.toDataURL({
					pixelRatio: 1.5,
					mimeType: "image/jpeg",
				});
				console.log("Items loaded into Konva layer by toDataURL()");
				const data = img.replace(/^data:image\/\w+;base64,/, "");
				// eslint-disable-next-line no-undef
				const buffer = Buffer.from(data, "base64");
				console.log(`pathDir: ${pathDir}`);
				resolve(buffer);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const getTemplateFields = (templateId: string): Promise<string[]> => {
	console.log("getTemplateFields()");
	return new Promise((resolve, reject) => {
		getTemplate(templateId)
			.then((template) => {
				console.log(template.data());
				const data: ITemplate = template.data() as ITemplate;
				console.log("Data:", Object.keys(data));
				const fields: string[] = [];
				data.canvas.items.forEach((item) => {
					if (item.type === "text") {
						if (!item.isConstant) fields.push(item.name);
					}
				});
				console.log(fields);
				resolve(fields);
			})
			.catch((err) => {
				reject(err);
				console.log(err);
			});
	});
};

export const makeid = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const getFieldsFromString = (string: string): string[] => {
	const results = [];
	const re = /{{([^}]+)}}/g;
	let text;
	while ((text = re.exec(string))) {
		results.push(text[1]);
	}
	return results;
};

export const replaceFieldsWithValue = (
	string: string,
	fields: TemplateField[]
): string => {
	let result = string;
	fields.forEach((field) => {
		if (field.value) result = result.replace(`{{ ${field} }}`, field.value);
	});
	return result;
};
