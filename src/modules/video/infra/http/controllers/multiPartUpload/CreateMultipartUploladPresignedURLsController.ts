import { Request, Response } from 'express';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import { creatPresignedUrlschema } from '../../../../dto/multipartUpload/CreatPresignedUrlsDTO';
import { videoRepository, storageProvider } from '../../../../../../shared/container';
import CreateMultipartUploladPresignedURLsService from '../../../../services/multiPartUpload/CreateMultipartUploladPresignedURLsService';

export default class CreateMultipartUploladPresignedURLsController {
    async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const params = videoIdParamSchema.parse(request.params);

        const body = creatPresignedUrlschema.parse(
            request.body,
        );

        const createMultipartUploladPresignedURLsService =
            new CreateMultipartUploladPresignedURLsService(
                videoRepository,
                storageProvider
            );

        const uploadParts =
            await createMultipartUploladPresignedURLsService.execute(
                params.id,
                body,
            );

        return response.status(201).json(
            uploadParts,
        );
    }
}