import { Request, Response } from 'express';
import { createVideoSchema } from '../../../dto/CreateVideoDTO';
import { videoRepository } from '../../../../../shared/container';
import CreateVideoService from '../../../services/CRUD/CreateVideoService';

export default class CreateVideoController {
    async index(request: Request, response: Response) {
        const videoMetaData = createVideoSchema.parse(
            request.body,
        );

        const createVideoService = new CreateVideoService(videoRepository);

        const video = await createVideoService.execute(videoMetaData);

        return response.status(201).json(video);
    }
}