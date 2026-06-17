import VideoMimeType from "./VideoMimeType";
import VideoStatus from "./VideoStatus";

class Video {
  id!: string;

  uploadId!: string;

  title!: string;

  description!: string | null;

  size!: string;

  mimeType!: VideoMimeType

  status!: VideoStatus;

  storageKey!: string | null;

  processedStorageKey?: string;

  manifestUrl?: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export default Video;
