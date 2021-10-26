import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import fs from "fs";
import env from "../../config";
import konva from "konva/cmj";
import canvas from "canvas";
import axios from "axios";
import { baseImage, field, template, text } from "../../models/template";
import { image } from "../../models/template";
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
export const getLoadedImage = (item: image | baseImage): Promise<Image> => {
	return new Promise((resolve, reject) => {
		if (item.imageStorageRef) {
			console.log(item.imageStorageRef);
			getDownloadURL(ref(getStorage(), item.imageStorageRef))
				.then((url) => {
					konva.Image.fromURL(url, (image: Image) => {
						if (item.type === "base-image") {
							image.x(0);
							image.y(0);
							image.width(item["width"]);
							image.height(item["height"]);
						} else {
							image.x(item.x);
							image.y(item.y);
							image.width(item.width);
							image.height(item.height);
						}
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
export const getLoadedText = (item: text, textValue: string): Promise<Text> => {
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
			align: item.textAlign || "center",
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
	template: template,
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
						getExistingFont(
							`${pathDir}/${fontFamily.replace(/ /g, "-")}.ttf`,
							fontFamily
						)
					);
				} else {
					//fs.mkdirSync(pathDir, { recursive: true })
					console.log("Pushing to promises");
					const promise: Promise<fontPath> = downloadFile(
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
const getExistingFont = (path: string, family: string): Promise<fontPath> => {
	return new Promise((resolve) => resolve({ path: path, family: family }));
};
/***
 * returns a promise that returns value with { path: outputLocationPath, family:family }
 */
const downloadFile = (
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
						console.log("Resolved font object from downloadFile");
					}
				});
			})
			.catch((err) => {
				console.log(err);
				reject("Error in downloading font");
			});
	});
};

export const getTemplateImage = (templateId: string, fields: field[]) => {
	return new Promise((resolve, reject) => {
		let template: template;
		const pathDir = `./storage/fonts/`;
		getTemplate(templateId)
			.then((temp) => {
				template = temp.data() as template;
				console.log(Object.keys(template));
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
						if (item.isConstant) promises.push(getLoadedText(item, item.name));
						else
							promises.push(
								getLoadedText(
									item,
									fields.find((i) => i.name === item.name)?.value
								)
							);
					}
					if (item.type === "image" || item.type === "base-image") {
						promises.push(getLoadedImage(item));
					}
				});
				return Promise.all(promises);
			})
			.then((items) => {
				const stage = new konva.Stage({ container: undefined });
				const layer = new konva.Layer();
				stage.x(0);
				stage.y(0);
				stage.height(
					template.canvas.items.find((item) => item.type === "base-image")[
						"height"
					]
				);
				stage.width(
					template.canvas.items.find((item) => item.type === "base-image")[
						"width"
					]
				);
				stage.scaleX(1);
				stage.scaleY(1);
				stage.add(layer);
				items.forEach((item) => layer.add(item));
				const img = stage.toDataURL({ pixelRatio: 3, mimeType: "image/jpeg" });
				console.log("Items loaded into Konva layer by toDataURL()");
				const data = img.replace(/^data:image\/\w+;base64,/, "");
				// eslint-disable-next-line no-undef
				const buffer = Buffer.from(data, "base64");
				console.log(`pathDir: ${pathDir}`);
				resolve(buffer);
			})
			.then(() => {
				console.log("fonts folder deleted");
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
				const data: template = template.data() as template;
				console.log("Data:", Object.keys(data));
				const fields: string[] = [];
				data.canvas.items.forEach((item) => {
					if (item.type === "text" || item.type === "image") {
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
