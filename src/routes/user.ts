import express from "express";
import * as controllers from "../controllers/user";
const router = express.Router();
router.get("/:uid", controllers.getUser);

router.post("/", controllers.createUser);
router.post("/stripeCustomer", controllers.createStripeCustomer);

router.put("/", controllers.updateUser);

// router.delete('/:id', deleteUser)

export default router;
