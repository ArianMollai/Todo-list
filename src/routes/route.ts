import express from "express";
import { repLogin, repCourses } from "../repositories/repository";
const router = express.Router();
import {
  loginUser,
  logoutUser,
  showCourses,
  showCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  newAccessToken,
} from "../controllers/controller";
import { isAuth } from "../middlewares/middleware";

router.post("/login", loginUser);
router.post("/logout", isAuth, logoutUser);
router.get("/courses", isAuth, showCourses);
router.get("/course/:name", isAuth, showCourse);
router.post("/create_course", isAuth, createCourse);
router.put("/update_course/:name", isAuth, updateCourse);
router.delete("/delete_course/:name", isAuth, deleteCourse);
router.post("/refresh_token", newAccessToken);

export default router;
