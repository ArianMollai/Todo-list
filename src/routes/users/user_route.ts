import express from 'express';
import { isAuth, validate } from '../../middlewares/validate';
import {
  signUpSchema,
  loginSchema,
  updateUserSchema,
  showOneUserSchema,
} from '../../schemas/users/user.schema';
import {
  signUp,
  loginUser,
  updateUser,
  deleteUser,
  logOut,
  newAccessToken,
  showUsers,
  showOneUser,
} from '../../controllers/users/user_controller';

const router = express.Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/login', validate(loginSchema), loginUser);
router.put('/update_user', isAuth, validate(updateUserSchema), updateUser);
router.delete('/delete_user', isAuth, deleteUser);
router.delete('/logout', isAuth, logOut);
router.get('/access_token', newAccessToken);
router.get('/showDB', showUsers);
router.get('/show_oneuser/:name', validate(showOneUserSchema), showOneUser);

export default router;
