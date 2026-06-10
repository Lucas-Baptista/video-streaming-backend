import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import VideoStatus from '../../../entities/VideoStatus';
import VideoMimeType from '../../../entities/VideoMimeType';

@Entity('videos')
export default class VideoORM {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true })
    uploadId!: string;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({type: 'bigint', nullable: false})
    size!: string;

    @Column({ type: 'enum', enum: VideoMimeType, default: VideoMimeType.MP4 })
    mimeType!: VideoMimeType;

    @Column({ type: 'enum', enum: VideoStatus, default: VideoStatus.PENDING_UPLOAD })
    status!: VideoStatus;

    @Column({ name: 'storage_key', type: 'text', nullable: true })
    storageKey!: string | null;

    @Column({ name: 'processed_storage_key', type: 'text', nullable: true})
    processedStorageKey?: string;

    @Column({ name: 'manifest_url', type: 'text', nullable: true})
    manifestUrl?: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}