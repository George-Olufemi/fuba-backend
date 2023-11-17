import joi from 'joi';

export const onboardingTutorSchema = joi.object({
    fullName: joi.string().required().max(20),
    email: joi.string().required().trim(),
    password: joi.string().required().min(6),
    confirmPassword: joi.string().valid(joi.ref('password')).required().strict(),
    picture: joi.string().required(),
});

export const onboardingLearnerSchema = joi.object({
    fullName: joi.string().required().max(20),
    email: joi.string().required().trim(),
    password: joi.string().required().min(6),
    confirmPassword: joi.string().valid(joi.ref('password')).required().strict(),
});