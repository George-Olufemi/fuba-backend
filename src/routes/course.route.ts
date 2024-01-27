import express from 'express';
import multer from 'multer';
import { ProtectMiddleware } from '../middlewares';
import {
  CreateCourseController,
  AllCourseController,
  ViewCourseController,
} from '../controllers';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

const router = express.Router();
const protectMiddleware = new ProtectMiddleware();
const createCourseController = new CreateCourseController();
const allCourseController = new AllCourseController();
const viewCourseController = new ViewCourseController();

router.get('/all-courses', allCourseController.getAllCourse);
router.get('/:courseId', viewCourseController.viewCourse);

router.post(
  '/new',
  protectMiddleware.authorize,
  protectMiddleware.requireTutorRole,
  upload.fields([{ name: 'course_image', maxCount: 1 }, { name: 'videos' }]),
  createCourseController.createCourse,
);

export default router;
