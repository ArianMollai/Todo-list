import express from "express";
//import { repLogin, repCourses } from "../repositories/repository";
const router = express.Router();
import {
  signUp,
  loginUser,
  updateUser,
  deleteUser,
  registerCourse,
  updateCourse,
  deleteCourse,
  showDB,
  newAccessToken,
} from "../controllers/controller";
import { isAuth } from "../middlewares/middleware";

router.post("/signup", signUp);
router.post("/login", loginUser);
router.put("/update_user", isAuth, updateUser);
router.delete("/delete_user", isAuth, deleteUser);
router.post("/register_course", isAuth, registerCourse);
router.put("/update_course/:course_name", isAuth, updateCourse);
router.delete("/delete_course", isAuth, deleteCourse);
router.get("/showDB", showDB);
router.get("/access_token", newAccessToken);

/*router.post("/logout", isAuth, logoutUser);
router.get("/courses", isAuth, showCourses);
router.get("/course/:name", isAuth, showCourse);
router.post("/create_course", isAuth, createCourse);
router.put("/update_course/:name", isAuth, updateCourse);
router.delete("/delete_course/:name", isAuth, deleteCourse);
router.post("/refresh_token", newAccessToken); */

export default router;
