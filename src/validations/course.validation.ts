import joi from 'joi';
import { Difficulty } from '../interface';

export const createCourseSchema = joi.object({
  course_title: joi.string().required().max(50).trim(),
  course_description: joi.string().required().trim(),
  course_image: joi.string().required(),
  difficulty: joi.string().valid(...Object.values(Difficulty)),
  course_category: joi.array().items(joi.string()).required(),
  modules: joi.array().items(
    joi.object({
      section: joi
        .array()
        .items(
          joi.object({
            title: joi.string().required().trim().max(20),
            description: joi.string().required().trim(),
            thumbnail: joi.string().required(),
            duration: joi.string().required(),
            video: joi.string().required(),
          }),
        )
        .required(),
    }),
  ),
});
