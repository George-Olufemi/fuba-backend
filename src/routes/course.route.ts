import express from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import CreateCourseController from '../controllers/Course/create-course.controller';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const createCourseController = new CreateCourseController();

router.post('/new', authMiddleware.authorize, createCourseController.createCourse);

export default router;
