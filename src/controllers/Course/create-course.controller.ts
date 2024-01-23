import { Request, Response } from 'express';
import { CloudinaryService } from '../../helper/cloudinary';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { CreateCourseService } from '../../services';
import { ForbiddenException } from '../../helper';
import Utils from '../../utils/utils';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const cloudinaryService: CloudinaryService = new CloudinaryService();
const createCourseService: CreateCourseService = new CreateCourseService();
const utilsService: Utils = new Utils();

export class CreateCourseController {
  // const allowedVideoTypes: string[] = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  public async createCourse(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user?._id;
    try {
      if (req.body.course_image) {
        await this.handleImageUpload(req);
      }

      // Check if videos are provided and handle the upload
      if (req.body.modules && req.body.modules.length > 0) {
        req.body.modules = await this.handleVideoUploads(req.body.modules);
      }

      const response = await createCourseService.createCourse(userId, req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  private async handleImageUpload(req: Request) {
    const allowedImageTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

    const fileName: string = await utilsService.randomFileName();
    const folder: string = 'Images';
    const filePath: Buffer = req.file.buffer;
    const mimeType: string = req.file.mimetype;

    if (!allowedImageTypes.includes(mimeType)) {
      throw new ForbiddenException(
        'Invalid file type. Only images (JPEG, JPG, PNG) are allowed.',
      );
    }

    const cloudinaryResponse: any = await cloudinaryService.upload(filePath, folder, {
      resource_type: 'image',
      public_id: fileName,
    });

    req.body.course_image = cloudinaryResponse.secure_url;
  }

  /*
  private async handleThumbnailUpload(req: Request) {
    const allowedThumbnailTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

    // Assuming modules is an array
    if (req.body.modules && req.body.modules.length > 0) {
      req.body.modules.forEach((module: any) => {
        // Assuming section is an array within each module
        if (module.section && module.section.length > 0) {
          module.section.forEach(async (section: any) => {
            const fileName: string = await utilsService.randomFileName();
            const folder: string = 'Images';
            const mimeType: string = section.thumbnail ? section.thumbnail.mimetype : '';

            if (!allowedThumbnailTypes.includes(mimeType)) {
              throw new ForbiddenException(
                'Invalid file type. Only images (JPEG, JPG, PNG) are allowed.',
              );
            }

            const cloudinaryResponse: any = await cloudinaryService.uploadImageToCloud(
              section.thumbnail.buffer,
              folder,
              {
                resource_type: 'image',
                public_id: fileName,
              },
            );

            // Update the thumbnail attribute
            section.thumbnail = cloudinaryResponse.secure_url;
          });
        }
      });
    }
  }
   */

  private async handleVideoUploads(modules: any[]): Promise<any[]> {
    const updatedModulesPromises = modules.map(async (module: any) => {
      if (module.section && module.section.length > 0) {
        const updatedSectionsPromises = module.section.map(async (section: any) => {
          if (section.video) {
            const fileName: string = await utilsService.randomFileName();
            const folder: string = 'course_videos';
            const filePath: Buffer = section.video.buffer;

            const cloudinaryResponse: any = await cloudinaryService.upload(
              filePath,
              folder,
              {
                resource_type: 'video',
                public_id: fileName,
              },
            );

            // Update the video attribute at the section level
            section.video = cloudinaryResponse.secure_url;
          }

          return section;
        });

        // Wait for all section updates within the module
        module.section = await Promise.all(updatedSectionsPromises);
      }

      return module;
    });

    // Wait for all module updates
    return Promise.all(updatedModulesPromises);
  }
}

/**
 * I have to take the following into account
 * The image for the course_image goes into a folder "course_images" in the cloud
 * The image for the thumbnails goes into a folder "thumbnails" in the cloud
 * The video file uploaded also goes into a folder "course_videos" in the cloud
 *
 * And for every upload of all this a secure url is generated that would be appended
 * to the attribute in the course model
 *
 *
 */
