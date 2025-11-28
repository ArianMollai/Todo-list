import express from 'express';
import { isAuth, validate } from '../../middlewares/validate';
import {
  newCourseSchema,
  updateCourseSchema,
  deleteCourseSchema,
  showOneCourseSchema,
} from '../../schemas/course/course.schema';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  showCourses,
  showOneCourse,
} from '../../controllers/courses/courses_controllers';

const router = express.Router();

router.post('/create_course', isAuth, validate(newCourseSchema), createCourse);
router.put(
  '/update_course/:name',
  isAuth,
  validate(updateCourseSchema),
  updateCourse,
);
router.delete(
  '/delete_course/:name',
  isAuth,
  validate(deleteCourseSchema),
  deleteCourse,
);
router.get('/show_courses', showCourses);
router.get(
  '/show_onecourse/:name',
  validate(showOneCourseSchema),
  showOneCourse,
);

export default router;
