import joi from 'joi';

export const editProfileSchema = joi.object({
  fullName: joi.string().lowercase().max(20),
  phoneNumber: joi.string().lowercase().max(20),
  bio: joi.string().lowercase().max(500),
  address: joi.object({
    country: joi.string().lowercase().max(200),
    postalCode: joi.string().lowercase().max(6),
    state: joi.string().lowercase().max(20),
  }),
});
