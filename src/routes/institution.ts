import express from "express";
import * as controllers from "../controllers/institution";
const router = express.Router();

router.get("/:id", controllers.getInstitution);

router.post("/", controllers.createInstitution);

router.put("/", controllers.updateInstitution);
router.put("/customFields", controllers.setCustomFields);

router.delete("/:id");

export default router;
