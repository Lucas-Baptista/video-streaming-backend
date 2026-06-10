import { Router } from "express";
import CreateVideoController from "../controllers/CRUD/CreateVideoController";
import ListVideoController from "../controllers/CRUD/ListVideoController";
import ListAllVideosController from "../controllers/CRUD/ListAllVideosController";
import UpdateVideoController from "../controllers/CRUD/UpdateVideoController";
import DeleteVideoController from "../controllers/CRUD/DeleteVideoController";

const videoRoutes = Router();

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

export default videoRoutes