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

  async findById(id: string): Promise<Video | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Video[]> {
    return this.ormRepository.find();
  }

  async update(
    id: string,
    data: Partial<Video>,
  ): Promise<Video> {
    const video = await this.findById(id);

    if (!video) {
      throw new Error('Video not found');
    }

    Object.assign(video, data);

    return this.ormRepository.save(video);
  }


  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }




}