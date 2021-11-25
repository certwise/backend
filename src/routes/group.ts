import express from "express";
import * as controllers from "../controllers/group";
const router = express.Router();

router.get("/:group", controllers.getOne);
router.get("/organization/:organization", controllers.getByOrganization);

router.post("/", controllers.create);

router.put("/", controllers.update);

router.delete("/:group", controllers.deleteGroup);

export default router;
