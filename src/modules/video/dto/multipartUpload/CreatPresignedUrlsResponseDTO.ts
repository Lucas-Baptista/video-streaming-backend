export type UploadPartDTO = {
  partNumber: number;
  uploadUrl: string;
};

export type CreatPresignedUrlsResponseDTO = {
  uploadUrls: UploadPartDTO[];
};