import express from "express";
import { isAuth } from "../../middlewares/middleware";
import {
  register,
  cancelRegister,
  showRegisters,
  showOneRegister,
} from "../../controllers/registers/register_controller";

const router = express.Router();

router.post("/register", isAuth, register);
router.delete("/cancel_register/:name", isAuth, cancelRegister);
router.get("/registers", showRegisters);
router.post("/oneregister", showOneRegister);

export default router;
