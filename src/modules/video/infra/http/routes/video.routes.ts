import { Router } from "express";
import CreateVideoController from "../controllers/CRUD/CreateVideoController";
import ListVideoController from "../controllers/CRUD/ListVideoController";
import ListAllVideosController from "../controllers/CRUD/ListAllVideosController";

const videoRoutes = Router();

//CREATE
const createVideoController = new CreateVideoController();
videoRoutes.post('/', createVideoController.index);

//READ
const listVideoController = new ListVideoController()
const listAllVideosController = new ListAllVideosController()
videoRoutes.get('/', listAllVideosController.index);
videoRoutes.get('/:id', listVideoController.index);

// //UPDATE
// videoRoutes.patch('/:id', );

// //DELETE
// videoRoutes.patch('/:id', );

export default videoRoutes