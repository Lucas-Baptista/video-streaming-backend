import { Repository } from 'typeorm';
import VideoORM from '../entities/VideoORM';
import AppDataSource from '../../../../../shared/infra/typeorm/data-source';
import Video from '../../../entities/Video';
import VideoStatus from '../../../entities/VideoStatus';
import IVideoRepository from '../../../repositories/IVideoRepository';
import { CreateVideoDTO } from '../../../dto/CreateVideoDTO';


export default class VideoRepository implements IVideoRepository {
  private ormRepository: Repository<VideoORM>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(VideoORM);
  }

  async create(data: CreateVideoDTO): Promise<Video> {
    const video = this.ormRepository.create({
      title: data.title,
      description: data.description,
      status: VideoStatus.PENDING_UPLOAD,
      mimeType: data.type,
      size: data.size
    });

    return this.ormRepository.save(video);
  }

  findById(id: string): Promise<Video | null> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Video[]> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Video>): Promise<Video> {
    throw new Error('Method not implemented.');
  }
  
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }




}