import express from 'express'
import * as controller from '../controllers/template.js'

const router = express.Router()

router.post('/one', controller.createTemplate)

router.get('/fields/:templateId', controller.getFields)
router.get('/one/:templateId', controller.getTemplateById)
router.get('/owner/:uid', controller.getTemplatesByUid)
router.get('/numberOfCertificates/:templateId', controller.getNumberOfCertificates)
router.put('/:templateId', controller.saveTemplate)

router.delete('/:templateId', controller.deleteTemplate)

export default router