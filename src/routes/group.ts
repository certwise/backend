import express from "express";
import * as controllers from "../controllers/group";
const router = express.Router();

router.get("/:id", controllers.getGroup);
router.get("/all/:instituteId", controllers.getGroups);

router.post("/", controllers.createGroup);

router.put("/", controllers.updateGroup);

router.delete("/:id");

export default router;
