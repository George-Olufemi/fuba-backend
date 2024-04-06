import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { ViewCourseService } from '../../services';
import mongoose from 'mongoose';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const viewCourseService: ViewCourseService = new ViewCourseService();

export class ViewCourseController {
  public async viewCourse(req: Request, res: Response) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.courseId);
      const response = await viewCourseService.viewCourse(courseId);
      return res.status(200).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
