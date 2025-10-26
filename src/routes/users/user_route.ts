import express from "express";
import { isAuth } from "../../middlewares/middleware";
import {
  signUp,
  loginUser,
  updateUser,
  deleteUser,
  newAccessToken,
  showUsers,
  showOneUser,
} from "../../controllers/users/user_controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginUser);
router.put("/update_user", isAuth, updateUser);
router.delete("/delete_user", isAuth, deleteUser);
router.get("/access_token", newAccessToken);
router.get("/showDB", showUsers);
router.get("/show_oneuser/:name", showOneUser);

export default router;
