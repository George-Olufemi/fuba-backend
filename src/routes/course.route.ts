import express from 'express';
import multer from 'multer';
import { ProtectMiddleware } from '../middlewares';
import { CreateCourseController } from '../controllers';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

const router = express.Router();
const protectMiddleware = new ProtectMiddleware();
const createCourseController = new CreateCourseController();

router.post(
  '/new',
  protectMiddleware.authorize,
  protectMiddleware.requireTutorRole,
  upload.fields([{ name: 'course_image', maxCount: 1 }, { name: 'videos' }]),
  createCourseController.createCourse,
);

export default router;
