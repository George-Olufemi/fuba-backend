import express from 'express';
import AuthController from '../controllers/auth.controller';
import multer from 'multer';

const router = express.Router();
const authController: AuthController = new AuthController();
const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

router.post('/registerAsTutor', upload.single('picture'), authController.onboardingTutor);
router.post('/registerAsLearner', authController.onboardingLearner);
router.get('/activate-account/:userToken', authController.verifyUserEmail);

router.post('/login', authController.login);

export default router;
