import { Request, Response } from 'express';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import { creatPresignedUrlschema } from '../../../../dto/multipartUpload/CreatPresignedUrlsDTO';
import { videoRepository, storageProvider } from '../../../../../../shared/container';
import CreatePresignedURLsService from '../../../../services/multiPartUpload/CreatePresignedURLsService';

export class CreatePresignedURLsController {
    async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const params = videoIdParamSchema.parse(request.params);

        const body = creatPresignedUrlschema.parse(
            request.body,
        );

        const createPresignedURLsService =
            new CreatePresignedURLsService(
                videoRepository,
                storageProvider
            );

        const uploadParts =
            await createPresignedURLsService.execute(
                params.id,
                body,
            );

        return response.status(201).json(
            uploadParts,
        );
    }
}