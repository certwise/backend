import Konva from "konva/cmj";
import { writeFileSync } from "fs";
const stage = new Konva.Stage({
	width: 500,
	height: 500,
	container: undefined as unknown as string,
});
const layer = new Konva.Layer();

const text = new Konva.Text({
	x: 10,
	y: 10,
	height: 100,
	width: 400,
	text: "Hello World",
	fontSize: 60,
	fontFamily: "Calibri",
	fill: "green",
	draggable: true,
});
console.log(text.attrs.text, text.textArr[0].text);
if (text.attrs.text !== text.textArr[0].text) {
	while (text.attrs.text !== text.textArr[0].text) {
		text.setAttr("fontSize", text.attrs.fontSize - 1);
		console.log(text.attrs.fontSize);
	}
}
stage.add(layer);
layer.add(text);
const img = stage.toDataURL({ pixelRatio: 3, mimeType: "image/jpeg" });
const data = img.replace(/^data:image\/\w+;base64,/, "");
const buffer = Buffer.from(data, "base64");
writeFileSync("test.jpg", buffer);
