import { getFirestore, collection, addDoc, setDoc, doc, getDoc } from 'firebase/firestore'
import { getStorage, uploadBytes, ref } from "firebase/storage";
import fs from "fs"
import { getTemplateImage, makeid } from './templateFunctions.js'

export const getCertificate = (req, res) => {
}

export const getAllCertificatesByUID = (req, res) => {
    let uid = req.params.uid
    let db = getFirestore()
    let result = []
    getDocs(collection(db, 'certificates'), where('uid', '==', uid))
        .then(docs => {
            docs.forEach(doc => {
                result.push({ id: doc.id, data: doc.data() })
            })
            res.send(result)
        }).catch(err => {
            console.log(err)
            res.send(err)
        })
}

export const createSingleCertificate = (req, res) => {
    let templateId = req.body.templateId.replace(/\s/g, '')
    let fields = req.body.fields
    let templateName = req.body.templateName
    let certificateName = `${req.body.receiverName}_${makeid(12)}.jpg`
    let certificateRef = `${req.body.uid}/certificates/${certificateName}`
    getTemplateImage(templateId, fields)
        .then(buffer => {
            console.log("Buffer created")
            fs.writeFileSync(`./storage/${certificateName}.jpg`, buffer)
            let file = fs.readFileSync(`./storage/${certificateName}.jpg`)
            return uploadBytes(ref(getStorage(), certificateRef), file)
        }).then(() => {
            console.log("File uploaded")
            let db = getFirestore()
            return addDoc(collection(db, "certificates"), {
                uid: req.body.uid,
                name: certificateName,
                fields,
                templateId,
                createdAt: new Date().toString(),
                receiverEmail: req.body.receiverEmail,
                receiverName: req.body.receiverName,
            })
        }).then(() => {
            console.log("Document added to firestore")
            fs.unlinkSync(`./storage/${certificateName}.jpg`)
            let db = getFirestore()
            return getDoc(doc(db, "templates", templateId))
        }).then(template => {
            let t = { ...template.data() }
            if (t['numberOfCertificates']) t['numberOfCertificates']++
            else t['numberOfCertificates'] = 1
            let db = getFirestore()
            return setDoc(doc(db, "templates", templateId), t)
        }).then(() =>
            res.send("Certificate uploaded successfully")
        ).catch(err => {
            res.send(err)
        })
}

export const bulkCreateCertificates = (req, res) => {
}

export const updateCertificate = (req, res) => {
}

export const bulkUpdateCertificates = (req, res) => {
}

export const deleteCertificate = (req, res) => {
}

export const bulkDeleteCertificates = (req, res) => {
}

export const getCertificatesByTemplate = (req, res) => {
    let templateId = req.params.templateId
    let db = getFirestore()
    let result = []
    getDocs(collection(db, 'certificates'), where('templateID', '==', templateId))
        .then(docs => {
            docs.forEach(doc => {
                result.push({ id: doc.id, data: doc.data() })
            })
            res.send(result)
        }).catch(err => {
            console.log(err)
            res.send(err)
        })
}
