import express from "express";
import { get, create, update, deleteUser } from "../controllers/user";
const router = express.Router();

router.get("/:uid", get);

// router.post("/", create);

router.put("/", update);

router.delete("/:uid", deleteUser);

export default router;
