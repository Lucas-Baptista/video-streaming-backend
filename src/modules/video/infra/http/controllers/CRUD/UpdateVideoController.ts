import { Request, Response } from 'express';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import { updateVideoSchema } from '../../../../dto/CRUD/UpdateVideoDTO';
import { videoRepository } from '../../../../../../shared/container';
import UpdateVideoService from '../../../../services/CRUD/UpdateVideoService';

export default class UpdateVideoController {
    async index(request: Request, response: Response) {
        const { id } = videoIdParamSchema.parse(request.params)

        const data = updateVideoSchema.parse(request.body);

        const updateVideoService = new UpdateVideoService(videoRepository);

        const video = await updateVideoService.execute(id, data);

        return response.status(200).json(video);
    }
}
