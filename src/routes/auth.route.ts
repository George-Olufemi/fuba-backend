import express from 'express';
import multer from 'multer';

import {
  SignUpAsTutorController,
  SignUpAsLearnerController,
  SignInController,
  VerifyEmailController,
} from '../controllers';

const router = express.Router();

const signUpAsTutor: SignUpAsTutorController = new SignUpAsTutorController();
const signUpAsLearner: SignUpAsLearnerController = new SignUpAsLearnerController();
const signInController: SignInController = new SignInController();
const verifyEmailController: VerifyEmailController = new VerifyEmailController();

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

router.post('/registerAsTutor', upload.single('picture'), signUpAsTutor.onboardingTutor);
router.post('/registerAsLearner', signUpAsLearner.onboardingLearner);
router.get('/activate-account/:userToken', verifyEmailController.verifyUserEmail);

router.post('/login', signInController.login);

export default router;
