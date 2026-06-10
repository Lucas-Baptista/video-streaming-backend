import { CreateVideoDTO } from "../dto/CRUD/CreateVideoDTO";
import Video from "../entities/Video";

export default interface IVideoRepository {
  create(data: CreateVideoDTO): Promise<Video>;

  findById(id: string): Promise<Video | null>;

  findAll(): Promise<Video[]>;

  update(id: string, data: Partial<Video>): Promise<Video>;

  delete(id: string): Promise<void>;
}