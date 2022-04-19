import express from "express";
import * as controller from "../controllers/template";

const router = express.Router();

router.post("/", controller.create);

router.get("/one/:templateId", controller.getById);
router.get("/organization/:organization", controller.getByOrganization);
router.get("/fields/:templateId", controller.getFields);
router.get(
	"/numberOfCertificates/:templateId",
	controller.getNumberOfCertificates
);

router.put("/update", controller.update);
router.put("/archive/:templateId", controller.archive);
router.put("/unarchive/:templateId", controller.unarchive);

router.delete("/:templateId", controller.deleteTemplate);

export default router;
