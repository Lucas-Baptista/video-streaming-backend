import { Router } from "express";
import CreateVideoController from "../controllers/CRUD/CreateVideoController";
import ListVideoController from "../controllers/CRUD/ListVideoController";
import ListAllVideosController from "../controllers/CRUD/ListAllVideosController";
import UpdateVideoController from "../controllers/CRUD/UpdateVideoController";
import DeleteVideoController from "../controllers/CRUD/DeleteVideoController";
import { CreatePresignedURLsController } from "../controllers/multiPartUpload/CreatePresignedURLsController";
import CompleteMultipartUploadController from "../controllers/multiPartUpload/CompleteMultipartUploadController";
import AbortMultipartUploadController from "../controllers/multiPartUpload/AbortMultipartUploadController";

const videoRoutes = Router();

//CRUD

//CREATE
const createVideoController = new CreateVideoController();
videoRoutes.post('/', createVideoController.index);

//READ
const listVideoController = new ListVideoController();
const listAllVideosController = new ListAllVideosController();
videoRoutes.get('/', listAllVideosController.index);
videoRoutes.get('/:id', listVideoController.index);

// //UPDATE
const updateVideoController = new UpdateVideoController();
videoRoutes.patch('/:id', updateVideoController.index);

//DELETE
const deleteVideoController = new DeleteVideoController();
videoRoutes.delete('/:id', deleteVideoController.index);


//Multipart Upload

//Generate Presigned URLs
const createPresignedURLsController = new CreatePresignedURLsController();
videoRoutes.post('/presigned-urls/:id', createPresignedURLsController.index);

//Complete Multipart Upload
const completeMultipartUploadController = new CompleteMultipartUploadController();
videoRoutes.post('/complete-upload/:id', completeMultipartUploadController.index);

//Abort Multipart Upload
const abortMultipartUploadController = new AbortMultipartUploadController();
videoRoutes.post('/abort-upload/:id', abortMultipartUploadController.index);

export default videoRoutes