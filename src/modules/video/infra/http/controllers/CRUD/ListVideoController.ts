import { Request, Response } from 'express';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import { videoRepository } from '../../../../../../shared/container';
import ListVideoService from '../../../../services/CRUD/ListVideoService';

export default class ListVideoController {
    async index(request: Request, response: Response) {
        const { id } = videoIdParamSchema.parse(request.params)

        const listVideoService = new ListVideoService(videoRepository);

        const video = await listVideoService.execute(id);

        return response.json(video);
    }
}