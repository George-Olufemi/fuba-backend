import joi from 'joi';
import { Difficulty, Category } from '../interface';

export const createCourseSchema = joi.object({
  course_title: joi.string().required().max(20).trim(),
  course_description: joi.string().required().trim(),
  course_image: joi.string().required(),
  difficulty: joi.string().valid(...Object.values(Difficulty)),
  course_category: joi.string().valid(...Object.values(Category)),
  sections: joi.array().items(
    joi.object({
      modules: joi.array().items(
        joi.object({
          title: joi.string().required().trim().max(20),
          description: joi.string().required().trim(),
          thumbnail: joi.string().required(),
          duration: joi.string().required(),
          video: joi.string().required(),
        })
      ).required(),
    })
  ),
});
