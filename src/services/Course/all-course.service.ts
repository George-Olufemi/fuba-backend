import Course from '../../models/course.model';
import User from '../../models/user.model';
import { logger, OkResponse } from '../../helper';

export class AllCourseService {
  public async getAllCourse() {
    const course = await Course.find().select(
      '-course_description -number_of_enrolled -course_category -createdAt -updatedAt',
    );
    try {
      const coursesWithAdditionalInfo = await Promise.all(
        course.map(async (courseObj) => {
          const user = await User.findById(courseObj.user);
          const numberOfModules = courseObj.modules.length;

          const additionalInformation = {
            author: user.fullName,
            author_image: user.picture,
            number_of_modules: numberOfModules,
          };

          return {
            ...courseObj.toObject(),
            meta_info: additionalInformation,
          };
        }),
      );

      coursesWithAdditionalInfo.map(async (module) => delete module.modules);

      return new OkResponse('Retrieved all courses', coursesWithAdditionalInfo);
    } catch (err: any) {
      console.error(err);

      logger.error(err.message);

      throw err;
    }
  }
}

// TODO: Add pagination when course is more than 10
