import express from "express";
import { isAuth } from "../../middlewares/middleware";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  showCourses,
  showOneCourse,
} from "../../controllers/courses/courses_controllers";

const router = express.Router();

router.post("/create_course", isAuth, createCourse);
router.put("/update_course/:name", isAuth, updateCourse);
router.delete("/delete_course/:name", isAuth, deleteCourse);
router.get("/show_courses", showCourses);
router.get("/show_onecourse/:name", showOneCourse);

export default router;
