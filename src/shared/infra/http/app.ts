import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error';
import videoRoutes from '../../../modules/video/infra/http/routes/video.routes';


const app = express();

app.use(cors());

app.use(express.json());

app.use('/videos', videoRoutes);

app.use(errorHandler);

export default app;