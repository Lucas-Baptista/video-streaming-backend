import { randomUUID } from "crypto";
import Video from "../../entities/Video";
import VideoStatus from "../../entities/VideoStatus";
import IVideoRepository from "../IVideoRepository";
import { CreateVideoDTO } from "../../dto/CreateVideoDTO";

export default class FakeVideoRepository implements IVideoRepository {
    private videos: Video[] = []

    async create(data: CreateVideoDTO): Promise<Video> {
        const video = {
            id: randomUUID(),

            title: data.title,

            description: data.description || null,

            status: VideoStatus.PENDING_UPLOAD,

            storageKey: null,

            createdAt: new Date(),

            updatedAt: new Date(),
        } as Video;

        return video;
    }

    async findAll(): Promise<Video[]> {
        return this.videos;
    }

    async findById(id: string): Promise<Video | null> {
        const video = this.videos.find(findVideo => findVideo.id === id);

        return video || null;
    }

    async update(id: string, data: Partial<Video>): Promise<Video> {
        const videoIndex = this.videos.findIndex(
            (video) => video.id === id,
        );

        if (videoIndex === -1) {
            throw new Error('Video not found');
        }

        this.videos[videoIndex] = {
            ...this.videos[videoIndex],
            ...data,
        };

        return this.videos[videoIndex];
    }

    async delete(id: string): Promise<void> {
        this.videos =
            this.videos.filter(
                video => video.id !== id,
            );
    }

}