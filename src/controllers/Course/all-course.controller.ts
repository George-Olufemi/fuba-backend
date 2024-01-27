import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { AllCourseService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const allCourseService: AllCourseService = new AllCourseService();

export class AllCourseController {
  public async getAllCourse(_req: Request, res: Response) {
    try {
      const response = await allCourseService.getAllCourse();
      return res.status(200).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
