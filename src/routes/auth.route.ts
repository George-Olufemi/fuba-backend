import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController: AuthController = new AuthController();

router.post('/register', authController.onboarding);

router.post('/login', authController.login);

export default router;