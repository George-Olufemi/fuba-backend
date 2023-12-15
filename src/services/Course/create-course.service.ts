import { logger, NotFoundException, OkResponse, ValidationException } from "../../helper";
import { ValidationError } from 'joi';
import Course from "../../models/course.model";
import User from '../../models/user.model';
import { Types } from "mongoose";
import { createCourseSchema } from "../../validations";
import { createCoursePayload } from "../../interface";

class CreateCourseService {

    public async createCourse(userId: Types.ObjectId, payload: createCoursePayload) {
        const user = await User.findById({ _id: userId });

        if (!user) throw new NotFoundException('The specified user does not exist.');
        
        try {
            await createCourseSchema.validateAsync(payload);

            const newCourse = await Course.create({
                course_title: payload.course_title,
                course_description: payload.course_description,
                course_image: payload.course_image,
                difficulty: payload.difficulty,
                course_category: payload.course_category,
                sections: payload.sections,
                user: userId
            });

            return new OkResponse('Course created successfully', newCourse);

        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                throw new ValidationException(err.details[0].message);
            }
            throw err;
        }
        
    }

}

export default CreateCourseService;