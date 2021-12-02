import express from "express";
import * as controller from "../controllers/certificate";
const router = express.Router();

router.post("/one", controller.createOne);
router.post("/many", controller.createMany);
router.post("/issue/one/:certificate", controller.issueOne);

router.get("/one/:id", controller.getOne);
router.get("/template/:templateId", controller.getByTemplate);
router.get("/organization/:organization", controller.getByOrganizaion);

router.put("/one", controller.update);

export default router;
