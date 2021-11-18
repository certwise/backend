import express from "express";
import * as controllers from "../controllers/recipient";
const router = express.Router();

router.get("/:id", controllers.getRecipient);
router.get(
	"/institution/:institutionId",
	controllers.getAllRecipientsInInstitution
);
router.post("/", controllers.createRecipient);

router.put("/", controllers.updateRecipient);

router.delete("/:id");

export default router;
