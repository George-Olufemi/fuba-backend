import express from 'express';

import { ProtectMiddleware } from '../middlewares';
import ProfileController from '../controllers/Account/profile.controller';

const router = express.Router();

const protectMiddleware: ProtectMiddleware = new ProtectMiddleware();
const profileController: ProfileController = new ProfileController();

router.get('/profile', protectMiddleware.authorize, profileController.getProfileInfo);

export default router;
