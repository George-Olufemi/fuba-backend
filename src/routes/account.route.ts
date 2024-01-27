import express from 'express';

import { ProtectMiddleware } from '../middlewares';
import { GetProfileController, EditProfileController } from '../controllers';

const router = express.Router();

const protectMiddleware: ProtectMiddleware = new ProtectMiddleware();
const getProfileInfoController: GetProfileController = new GetProfileController();
const editProfileController: EditProfileController = new EditProfileController();

router.get(
  '/profile',
  protectMiddleware.authorize,
  getProfileInfoController.getProfileInfo,
);
router.patch(
  '/edit-profile',
  protectMiddleware.authorize,
  editProfileController.editProfile,
);

export default router;
