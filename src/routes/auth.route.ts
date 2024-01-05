import express from 'express';
import multer from 'multer';

import SignUpAsTutorController from '../controllers/Auth/signUpAsTutor';
import SignUpAsLearnerController from '../controllers/Auth/signUpAsLearner';
import SignInController from '../controllers/Auth/signin';
import VerifyEmailController from '../controllers/Auth/verifyEmail';

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
