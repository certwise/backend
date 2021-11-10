import express from "express";
import * as controllers from "../controllers/recipient";
const router = express.Router();

router.get("/:id", controllers.getRecipient);

router.post("/", controllers.createRecipient);

router.put("/", controllers.updateRecipient);

router.delete("/:id");

export default router;
