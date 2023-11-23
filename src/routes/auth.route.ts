import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController: AuthController = new AuthController();

router.post('/registerAsTutor', authController.onboardingTutor);
router.post('/registerAsLearner', authController.onboardingLearner);
router.get('/activate-account/:userToken', authController.verifyUserEmail);

router.post('/login', authController.login);

export default router;
