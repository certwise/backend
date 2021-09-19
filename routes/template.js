import express from 'express'
import * as controller from '../controllers/template.js'

const router = express.Router()

router.post('/one', controller.createTemplate)

router.get('/fields/:id', controller.getFields)
router.get('one/:id', controller.getTemplateById)
router.get('/owner/:uid', controller.getTemplatesByUid)

router.put('/:id', controller.saveTemplate)

router.delete('/:id', controller.deleteTemplate)

export default router