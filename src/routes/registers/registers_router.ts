import express from 'express';
import { isAuth, validate } from '../../middlewares/validate';
import {
  registerNewCourseSchema,
  cancelRegisterationSchema,
  showOneRegistrationSchema,
} from '../../schemas/registers/register.schema';
import {
  register,
  cancelRegister,
  showRegisters,
  showOneRegister,
} from '../../controllers/registers/register_controller';

const router = express.Router();

router.post('/register', isAuth, validate(registerNewCourseSchema), register);
router.delete(
  '/cancel_register/:name',
  isAuth,
  validate(cancelRegisterationSchema),
  cancelRegister,
);
router.get('/registers', showRegisters);
router.post(
  '/oneregister',
  validate(showOneRegistrationSchema),
  showOneRegister,
);

export default router;
