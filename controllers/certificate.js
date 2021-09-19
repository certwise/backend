import { getFirestore, collection, addDoc, } from 'firebase/firestore'
import { getStorage, uploadBytes, ref } from "firebase/storage";
import fs from "fs"
import { getTemplateImage, makeid } from './templateFunctions.js'

export const getCertificate = (req, res) => {
}

export const getAllCertificatesByUID = (req, res) => {
}

export const createSingleCertificate = (req, res) => {
    let templateId = req.body.templateId
    let fields = req.body.fields
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
                createdAt: new Date(),
                receiverEmail: req.body.receiverEmail,
                receiverName: req.body.receiverName,
            })
        }).then(() => {
            console.log("Document added to firestore")
            fs.unlinkSync(`./storage/${certificateName}.jpg`)
            res.send(certificateRef)
        }).catch(err => {
            res.send(err)
        })
}

export const bulkCreateCertificatesFromCSV = (req, res) => {
}

export const updateCertificate = (req, res) => {
}

export const bulkUpdateCertificatesFromCSV = (req, res) => {
}

export const deleteCertificate = (req, res) => {
}

export const bulkDeleteCertificates = (req, res) => {
}

export const getCertificatesByTemplate = (req, res) => {
}
