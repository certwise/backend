import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import fs from 'fs'
import env from '../config.js'
import konva from 'konva'
import canvas from 'canvas'
import axios from 'axios'

/***
 * Get template object from firestore with given **templateId**
 */
export const getTemplate = templateId => {
    const db = getFirestore(env.firebaseApp)
    const template = doc(db, 'templates', templateId)
    console.log(`Getting template ${templateId}`)
    return getDoc(template)
}

/***
 * pass in imageItem and get the konva Image object that can be added to a layer
 */
export const getLoadedImage = (item) => {
    return new Promise((resolve, reject) => {
        if (item.storageRef) {
            console.log(item.storageRef)
            getDownloadURL(ref(getStorage(), item.storageRef))
                .then(url => {
                    konva.Image.fromURL(url, image => {
                        if (item.type === 'base-image') {
                            image.x(0)
                            image.y(0)
                            image.width(item['original-width'])
                            image.height(item['original-height'])
                        } else {
                            image.x(item.x)
                            image.y(item.y)
                            image.width(item.width)
                            image.height(item.height)
                        }
                        resolve(image)
                        return image
                    })
                }).catch(err => {
                    console.log(err)
                })
        } else {
            resolve(new konva.Image())
        }
    })

}

/***
 * pass in textItem and get the konva Text object that can be added to a layer
 */
export const getLoadedText = (item, textValue) => {
    return new Promise((resolve, reject) => {
        console.log(`getLoadedText()`)
        const text = new konva.Text({
            x: item.x,
            y: item.y,
            height: item.height,
            width: item.width,
            text: textValue,
            fontSize: item.attr.fontSize,
            fontFamily: item.attr.fontFamily,
            align: item.attr.align || 'center',
            fill: item.fill || item.color,
            id: item.id,
        })
        console.log(text)
        resolve(text)
    })

}

/***
 * returns a promise that returns array of values with { path: outputLocationPath, family:family }
 */
export const getAllFontsFromTemplate = (template, pathDir) => {
    console.log('Getting fonts from templatesss')
    let promises = []
    for (let i in template.canvas.items) {
        let item = template.canvas.items[i]
        if (item.type === 'text') {
            if (item.attr.fileLink) {
                let fileLink = item.attr.fileLink
                let fontFamily = item.attr.fontFamily
                if (fs.existsSync(`${pathDir}/${fontFamily.replace(/ /g, '-')}.ttf`)) {
                    console.log(`${fontFamily} already exists`)
                    promises.push(getExistingFonts(`${pathDir}/${fontFamily.replace(/ /g, '-')}.ttf`, fontFamily))
                } else {
                    //fs.mkdirSync(pathDir, { recursive: true })
                    console.log("Pushing to promises")
                    let promise = downloadFile(fileLink, `${pathDir}/${fontFamily.replace(/ /g, '-')}.ttf`, fontFamily)
                    promises.push(promise)
                    console.log("Pushed to promises")
                }
            }
        }
    }
    console.log(`Promises: ${promises}`)
    return Promise.all(promises)
}

/***
 * returns a promise that returns value with { path: outputLocationPath, family:family }
 */
const downloadFile = (fileUrl, outputLocationPath, family) => {
    console.log(`Downloading ${fileUrl} to ${outputLocationPath}`)
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputLocationPath)
        axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then(response => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject('Error in saving font to storage')
            })
            writer.on('close', () => {
                if (!error) {
                    resolve({ path: outputLocationPath, family: family })
                    console.log("Resolved font object from downloadFile")
                }
            })
        }).catch(err => {
            console.log(err)
            reject('Error in downloading font')
        })
    })
}

const getExistingFonts = (path, family) => {
    return new Promise((resolve, r) => resolve({ path: path, family: family }))
}

export const getTemplateImage = (templateId, fields) => {
    return new Promise((resolve, reject) => {
        let fontDir = ''
        let template = { canvas: { items: [] } }
        //let randomId = makeid(20)
        let pathDir = `./storage/fonts/`
        getTemplate(templateId)
            .then(temp => {
                template = temp.data()
                console.log(Object.keys(template))
                return getAllFontsFromTemplate(template, pathDir)
            })
            .then(fontsObj => {
                console.log("fonts loaded to storage")
                fontsObj.forEach(obj => {
                    fontDir = obj.folder
                    canvas.registerFont(obj.path, { family: obj.family })
                })
                let promises = []
                template.canvas.items.map((item) => {
                    console.log(item.type)
                    if (item.type === 'text') {
                        if (item.isConstant)
                            promises.push(getLoadedText(item, item.value))
                        else
                            promises.push(getLoadedText(item, fields[item.name]))
                    }
                    if (item.type === 'image' || item.type === 'base-image') {
                        promises.push(getLoadedImage(item))
                    }
                })
                return Promise.all(promises)
            }).then(items => {
                let stage = new konva.Stage()
                let layer = new konva.Layer()
                stage.x(0)
                stage.y(0)
                stage.height(template.canvas.items.find(item => item.type === "base-image")['height'])
                stage.width(template.canvas.items.find(item => item.type === "base-image")['width'])
                stage.scaleX(1)
                stage.scaleY(1)
                stage.add(layer)
                items.forEach(item =>
                    layer.add(item)
                )
                let img = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' })
                console.log("Items loaded into Konva layer by toDataURL()")
                var data = img.replace(/^data:image\/\w+;base64,/, "")
                var buffer = Buffer.from(data, 'base64')
                console.log(`pathDir: ${pathDir}`)
                stage = null
                resolve(buffer)
            }).then((res) => {
                console.log("fonts folder deleted")
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

export const getTemplateFields = (templateId) => {
    console.log("getTemplateFields()")
    return new Promise((resolve, reject) => {
        getTemplate(templateId)
            .then(template => {
                console.log(template.data())
                let data = template.data()
                console.log("Data:", Object.keys(data))
                let fields = []
                data.canvas.items.forEach(item => {
                    if (!item.isConstant && item.type === 'text')
                        fields.push(item.name)
                })
                console.log(fields)
                resolve(fields)
            }).catch(err => {
                reject(err)
                console.log(err)
            })
    })
}


export const makeid = (length) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
    }
    return result
}
