import { getTemplateFields, makeid } from './templateFunctions.js'
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, setDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, uploadBytes, deleteObject, ref } from "firebase/storage";

export const createTemplate = async (req, res) => {
    const uid = req.body.uid
    const name = req.body.name
    const template = {
        name,
        description,
        uid,
        createdAt: new Date().getTime(),
        exportCertificatesAs: "png",
        numberOfCertificates: 0,
        canvas: {
            items: [
                {
                    type: 'base-image',
                    x: 0,
                    y: 0,
                    id: makeid(12),
                    draggable: false,
                    type: "base-image",
                    name: "Base template image",
                    alt: "Example image",
                    storageRef: "default_template_images/base.jpg",
                    width: "1920",
                    height: "1080",
                    isConstant: true,
                },
                {
                    type: "text",
                    name: "Text field",
                    value: "Example text field",
                    x: 25,
                    y: 25,
                    fill: "#000",
                    attr: {
                        fontSize: 100,
                        fontFamily: "Roboto",
                        align: 'center',
                        fontWeight: "300"
                    },
                    height: "300",
                    width: "700",
                    isConstant: false,
                },
            ],
        }
    }
    const db = getFirestore()
    const result = await addDoc(collection(db, 'templates'), template)
    console.log('Creating a new template for user :', uid, 'with name :', name)
    console.log("Template:", template)
    res.send("Successfully created Template with name:")
}

export const getTemplateById = async (req, res) => {
    const templateId = req.params.templateId
    const db = getFirestore()
    const template = await getDoc(doc(db, 'templates', templateId))
    console.log("Getting template with id :", templateId)
    console.log("Data :", template.data())
    res.send(template.data())
}

export const getTemplatesByUid = async (req, res) => {
    const uid = req.body.uid
    const db = getFirestore()
    let result = []
    const templates = await getDocs(collection(db, 'templates'), where('uid', '==', uid))
    templates.forEach(res => {
        result.push({ id: res.id, 'data': res.data() })
    })
    console.log("Getting templates of user with uid :", uid)
    console.log("Result :", result)
    res.send(result)
}

export const saveTemplate = async (req, res) => {
    const templateId = req.body.templateId
    let templateItems = req.body.templateItems
    const docRef = doc(db, "templates", templateId)
    const docSnap = await getDoc(docRef)
    const template = {
        ...docSnap.data(),
        canvas: {
            ...docSnap.data().canvas,
            items: templateItems,
        }
    }
    const result = await setDoc(doc(db, 'templates', templateId), template)
    res.send(result)
}

export const deleteTemplate = async (req, res) => {
    const templateId = req.body.templateId
    await deleteDoc(doc(db, 'templates', templateId))
    res.send("Template deleted successfully")
}

export const getFields = (req, res) => {
    console.log("Getting fields...")
    getTemplateFields(req.params.templateId.replace(/\s/g, '')).then(fields => {
        console.log("Fields:", fields)
        res.send(fields)
    }).catch(err => {
        res.send(err)
    })
}

export const getNumberOfCertificates = async (req, res) => {
    const templateId = req.params.templateId
    const db = getFirestore()
    const count = await getDocs(collection(db, 'certificates'), where('templateId', '==', templateId))
    let c = 0
    count.forEach(d => {
        c++
    })
    res.send(c)
}

