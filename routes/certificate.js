import express from 'express'
import * as controller from '../controllers/certificate.js'
const router = express.Router()

router.post('/one', controller.createSingleCertificate)
router.post('/bulk', controller.bulkCreateCertificatesFromCSV)

router.get('/one/:id', controller.getCertificate)
router.get('/template/:templateId', controller.getCertificatesByTemplate)
router.get('/owner/:uid', controller.getAllCertificatesByUID)


router.put('/one/:id', controller.updateCertificate)
router.put('/many', controller.bulkUpdateCertificatesFromCSV)

router.delete('/one/:id', controller.deleteCertificate)
router.delete('/many', controller.bulkDeleteCertificates)
export default router