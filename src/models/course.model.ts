import mongoose, { Schema } from 'mongoose';
import { Difficulty, ICourse, IModule, ISection } from '../interface';

const SectionSchema: Schema<ISection> = new Schema<ISection>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  video: { type: Schema.Types.Mixed, required: true },
});

const ModuleSchema: Schema<IModule> = new Schema<IModule>({
  section: {
    type: [SectionSchema],
    default: null,
  },
});

const CourseSchema: Schema<ICourse> = new Schema<ICourse>(
  {
    course_title: {
      type: String,
      required: true,
    },
    course_description: {
      type: String,
      required: true,
    },
    course_image: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: Difficulty,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    number_of_enrolled: {
      type: Number,
      default: 0,
    },
    course_category: {
      type: [String],
      required: true,
    },
    modules: {
      type: [ModuleSchema],
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const course = mongoose.model<ICourse>('Course', CourseSchema);
export default course;
