import Konva from "konva"
import fs from "fs"
let stage = new Konva.Stage({
    width: 500,
    height: 500,
})
let layer = new Konva.Layer()

let text = new Konva.Text({
    x: 10,
    y: 10,
    height: 100,
    width: 400,
    text: 'Hello World',
    fontSize: 60,
    fontFamily: 'Calibri',
    fill: 'green',
    draggable: true,
})
console.log(text.attrs.text, text.textArr[0].text)
if (text.attrs.text !== text.textArr[0].text) {
    while (text.attrs.text !== text.textArr[0].text) {
        text.setAttr('fontSize', text.attrs.fontSize - 1)
        console.log(text.attrs.fontSize)
    }
}
stage.add(layer)
layer.add(text)
let img = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' })
let data = img.replace(/^data:image\/\w+;base64,/, "")
let buffer = Buffer.from(data, 'base64')
fs.writeFileSync('test.jpg', buffer)