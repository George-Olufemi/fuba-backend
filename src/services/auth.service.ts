import { logger, ValidationException, Httpcode, BadRequestException, OkResponse } from "../helper";
import { ValidationError } from "joi";
import { onboardingLearnerSchema, onboardingTutorSchema } from "../validations";
import { tutorsPayload, Position, learnersPayload } from "../interface";
import User from '../models/user.model';
import bcrypt from 'bcrypt';

class AuthService {

    public async signUpAsTutor(payload: tutorsPayload): Promise<OkResponse | BadRequestException> {
        try {
            await onboardingTutorSchema.validateAsync(payload);
            const user = await User.findOne({ email: payload.email });
            if (!user) {
                const hashedPassword = await this.hashPassword(payload.password);
                await User.create({
                    fullName: payload.fullName,
                    email: payload.email,
                    picture: payload.picture,
                    password: hashedPassword,
                    position: Position.Tutor
                });
                // TODO: Input mail logic here
                return new OkResponse('Check provided email inbox for verification mail');
            }
            throw new BadRequestException({
                httpCode: Httpcode.BAD_REQUEST,
                description: "User with email already exist"
            });

        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                throw new ValidationException({
                    httpCode: Httpcode.VALIDATION_ERROR,
                    description: err.details[0].message,
                });
            }
            throw err;
        }
    }

    public async signUpAsLearner(payload: learnersPayload) {
        try {
            await onboardingLearnerSchema.validateAsync(payload);
            const user = await User.findOne({ email: payload.email });
            if (!user) {
                const hashedPassword = await this.hashPassword(payload.password);
                await User.create({
                    fullName: payload.fullName,
                    email: payload.email,
                    password: hashedPassword,
                    position: Position.Learner
                });
                // TODO: Input mail logic here
                return new OkResponse('Check provided email inbox for verification mail');
            }
            throw new BadRequestException({
                httpCode: Httpcode.BAD_REQUEST,
                description: "User with email already exist"
            });

        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                throw new ValidationException({
                    httpCode: Httpcode.VALIDATION_ERROR,
                    description: err.details[0].message,
                });
            }
            throw err;
        }
    }

    public async signIn() {
        return 'This is the login service';
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = Number(process.env.SALT);
        return await bcrypt.hash(password, salt);
    }
}

export default AuthService;
