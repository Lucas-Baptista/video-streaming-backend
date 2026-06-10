import { Router } from "express";
import CreateVideoController from "../controllers/CreateVideoController";

const videoRoutes = Router();

//CREATE
const createVideoController = new CreateVideoController();
videoRoutes.post('/', createVideoController.index);

// //READ
// videoRoutes.get('/', );
// videoRoutes.get('/:id', );

// //UPDATE
// videoRoutes.patch('/:id', );

// //DELETE
// videoRoutes.patch('/:id', );

export default videoRoutes