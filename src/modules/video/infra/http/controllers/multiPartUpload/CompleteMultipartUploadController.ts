import { videoRepository, storageProvider } from "../../../../../../shared/container";
import { completeMultipartUploadSchema } from "../../../../dto/multipartUpload/CompleteMultipartUploadDTO";
import { videoIdParamSchema } from "../../../../dto/params/videoIdParamSchemaDTO";
import { Request, Response } from "express";
import CompleteMultipartUploadService from "../../../../services/multiPartUpload/CompleteMultipartUploadService";

export default class CompleteMultipartUploadController {
    async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = videoIdParamSchema.parse(request.params)
        const body = completeMultipartUploadSchema.parse(request.body)

        const completeMultipartUploadService = new CompleteMultipartUploadService(
            videoRepository,
            storageProvider
        )

        await completeMultipartUploadService.execute(
            id,
            body
        )

        return response.status(204).send();
    }
}
