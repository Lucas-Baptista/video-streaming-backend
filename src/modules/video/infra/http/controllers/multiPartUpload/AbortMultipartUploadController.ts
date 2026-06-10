import { Request, Response } from 'express';
import { videoRepository, storageProvider } from '../../../../../../shared/container';
import { videoIdParamSchema } from '../../../../dto/params/videoIdParamSchemaDTO';
import AbortMultipartUploadService from '../../../../services/multiPartUpload/AbortMultipartUploadService';


export default class AbortMultipartUploadController {
  async index(
    request: Request,
    response: Response,
  ): Promise<Response> {
    // const params =
    //   videoIdParamSchema.parse(
    //     request.params,
    //   );

    const { key, id } = request.body

    const abortMultipartUploadService =
      new AbortMultipartUploadService(
        videoRepository,
        storageProvider,
      );

    await abortMultipartUploadService.execute(
      key, id
    );

    return response.status(204).send();
  }
}