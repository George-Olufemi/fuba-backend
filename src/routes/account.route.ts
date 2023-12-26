import express from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import ProfileController from '../controllers/Account/profile.controller';

const router = express.Router();

const authMiddleware: AuthMiddleware = new AuthMiddleware();
const profileController: ProfileController = new ProfileController();

router.get('/profile', authMiddleware.authorize, profileController.getProfileInfo);

export default router;
