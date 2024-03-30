import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
