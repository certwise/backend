import express from "express";
import * as controllers from "../controllers/recipient";
const router = express.Router();

router.get("/:recipient", controllers.get);
router.get("/organization/:organization", controllers.getByOrganization);
router.get("/group/:group", controllers.getByGroup);

router.post("/", controllers.create);
router.post("/bulk", controllers.createBulk);

router.put("/", controllers.update);

router.delete("/:recipient");

export default router;
