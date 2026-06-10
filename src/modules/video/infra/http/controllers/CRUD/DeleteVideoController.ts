import { Request, Response } from 'express';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import { videoRepository } from '../../../../../../shared/container';
import DeleteVideoService from '../../../../services/CRUD/DeleteVideoService';

export default class DeleteVideoController {
    async index(request: Request, response: Response) {
        const { id } = videoIdParamSchema.parse(request.params)

        const deleteVideoService = new DeleteVideoService(videoRepository);

        await deleteVideoService.execute(id);

        return response.status(204).send();
    }
}