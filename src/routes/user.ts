import express from "express";
import * as controllers from "../controllers/user";
const router = express.Router();
router.get("/:uid", controllers.get);

router.post("/", controllers.create);

router.put("/", controllers.update);

// router.delete('/:id', deleteUser)

export default router;
