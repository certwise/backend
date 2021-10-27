import express from "express";
import * as controller from "../controllers/template";

const router = express.Router();

router.post("/", controller.createTemplate);
router.post("/canvas/item/addImage", controller.addImageToCanvas);

router.get("/fields/:templateId", controller.getFields);
router.get("/one/:templateId", controller.getTemplateById);
router.get("/uid/:uid", controller.getTemplatesByUid);
router.get(
	"/numberOfCertificates/:templateId",
	controller.getNumberOfCertificates
);
router.get("/name-uid", controller.getTemplateByNameAndUid);

router.get("/names/:uid", controller.getTemplateNamesByUid);

router.put("/update/:templateId", controller.updateTemplate);
router.put("/rename", controller.renameTemplate);

router.delete("/:templateId", controller.deleteTemplate);

export default router;
