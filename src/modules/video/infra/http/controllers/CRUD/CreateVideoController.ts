import { Request, Response } from 'express';
import { videoRepository } from '../../../../../../shared/container';
import CreateVideoService from '../../../../services/CRUD/CreateVideoService';
import { createVideoSchema } from '../../../../dto/CRUD/CreateVideoDTO';

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