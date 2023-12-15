import { Request, Response } from 'express';
import Cloudinary from '../../helper/cloudinary';
import CustomErrorHandler from '../../helper/custom-error-handler';
import CreateCourseService from '../../services/Course/create-course.service';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const cloudinaryService: Cloudinary = new Cloudinary();
const createCourseService: CreateCourseService = new CreateCourseService();

class CreateCourseController {

    public async createCourse(req: Request, res: Response) {

    }

}

export default CreateCourseController;


/**
 * I have to take the following into account 
 * The image for the course_image goes into a folder "course_images" in the cloud
 * The image for the thumbnails goes into a folder "thumbnails" in the cloud
 * The video file uploaded also goes into a folder "course_videos" in the cloud
 * 
 * And for every upload of all this a secure url is generated that would be appended
 * to the attribute in the course model
 * 
 * 
 */