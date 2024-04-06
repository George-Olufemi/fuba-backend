import { BadRequestException, logger, OkResponse } from '../../helper';
import Course from '../../models/course.model';
import User from '../../models/user.model';
import { Types } from 'mongoose';

export class ViewCourseService {
  public async viewCourse(courseId: Types.ObjectId) {
    const course = await Course.findById(courseId).select(
      '-course_category -createdAt -updatedAt',
    );
    const user = await User.findById(course.user);
    const additional_info = { author: user.fullName };
    if (!course) throw new BadRequestException('Course not found');
    try {
      const courseInfo = {
        ...course.toObject(),
        meta_info: additional_info,
      };
      return new OkResponse('Retrieved course information', courseInfo);
    } catch (err: any) {
      console.error(err);

      logger.error(err.message);

      throw err;
    }
  }
}
