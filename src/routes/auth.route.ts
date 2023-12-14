import express from 'express';
import multer from 'multer';

import SignInController from '../controllers/Auth/signin.controller';
import VerifyEmailController from '../controllers/Auth/verifyEmail.controller';
import RegisterController from '../controllers/Auth/register.controller';

const router = express.Router();

const registerController: RegisterController = new RegisterController();
const signInController: SignInController = new SignInController();
const verifyEmailController: VerifyEmailController = new VerifyEmailController();

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

router.post(
  '/registerAsTutor',
  upload.single('picture'),
  registerController.onboardingTutor,
);
router.post('/registerAsLearner', registerController.onboardingLearner);
router.get('/activate-account/:userToken', verifyEmailController.verifyUserEmail);

router.post('/login', signInController.login);

export default router;
