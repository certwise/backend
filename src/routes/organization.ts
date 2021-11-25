import express from "express";
import * as controllers from "../controllers/organization";
const router = express.Router();

router.get("/:id", controllers.get);

router.post("/", controllers.create);

router.put("/", controllers.update);

router.delete("/:id");

export default router;
