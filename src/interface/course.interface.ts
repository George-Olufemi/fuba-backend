import { Types } from 'mongoose';

export enum Difficulty {
    Beginner = 'Beginner',
    Intermidate = 'Intermidate',
    Advance = 'Advance'
}

export enum Category {
    Freelance = 'Freelance',
    Development = 'Development',
    Featured = 'Featured',
    Blockchain = 'Blockchain',
    Design = 'Design'
}

export interface IModule {
    title: string;
    description: string
    thumbnail: string;
    video_description: string;
    video: string;
    duration: string;
}

export interface ISection extends Document {
    _id: Types.ObjectId;
    modules: IModule[];
}

export interface ICourse extends Document {
    _id: Types.ObjectId;
    course_title: string;
    course_description: string;
    course_image: string;
    difficulty: Difficulty;
    rating: number;
    number_of_enrolled: number;
    course_category: string [];
    sections: ISection[];
}


// The Approach I am looking for

/* const sampleCourse: ICreateCourse = {
    title: 'Your Course Title',
    description: 'Your course description.',
    image: 'path/to/course/image.jpg',
    difficulty: Difficulty.Beginner,
    categories: ['Programming', 'Web Development'],
    sections: [
        {
            modules: [
                {
                    title: 'Module 1: Course Introduction',
                    description: 'Overview of the course content.',
                    thumbnail: 'path/to/thumbnail.jpg',
                    duration: '3 hours',
                    video: 'path/to/video.mp4',
                },
                // More modules for Section 1
            ],
        },
        {
            modules: [
                // Modules for Section 2
            ],
        },
        // More sections
    ],
}; */
