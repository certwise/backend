import express from "express";
import * as controllers from "../controllers/recipient";
const router = express.Router();

router.get("/:id");
router.get("/group/:groupid");
router.get("/uid/:uid");

router.post("/one");
router.post("/many");

router.put("/");

router.delete("/:id");

export default router;
