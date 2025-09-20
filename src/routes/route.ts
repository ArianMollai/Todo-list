import express from "express";
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

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/courses", showCourses);
router.get("/course/:name", showCourse);
router.post("/create_course", createCourse);
router.put("/update_course/:name", updateCourse);
router.delete("/delete_course/:name", deleteCourse);
router.post("/refresh_token", newAccessToken);

export default router;
