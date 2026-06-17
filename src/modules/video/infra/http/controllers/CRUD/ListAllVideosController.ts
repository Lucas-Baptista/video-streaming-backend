import { Request, Response } from 'express';
import { videoRepository } from '../../../../../../shared/container';
import ListAllVideosService from '../../../../services/CRUD/ListAllVideosService';

export default class ListAllVideosController {
    async index(request: Request, response: Response) {
        const listAllVideosService = new ListAllVideosService(videoRepository);

        const video = await listAllVideosService.execute();

        return response.json(video);
    }
}