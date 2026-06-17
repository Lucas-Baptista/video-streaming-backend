import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideosTable1781027693328
    implements MigrationInterface {
    name = 'CreateVideosTable1781027693328';

    public async up(
        queryRunner: QueryRunner,
    ): Promise<void> {
        await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

        await queryRunner.query(`
      CREATE TYPE "public"."videos_status_enum"
      AS ENUM (
        'PENDING_UPLOAD',
        'PROCESSING',
        'READY',
        'FAILED'
      )
    `);

        await queryRunner.query(`
      CREATE TABLE "videos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "description" text,
        "status" "public"."videos_status_enum"
          NOT NULL DEFAULT 'PENDING_UPLOAD',

        "size" bigint NOT NULL,
        "mimeType" varchar NOT NULL,

        "storage_key" text,
        "uploadId" varchar,

        "processed_storage_key" varchar,
        "manifest_url" varchar,

        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_videos"
          PRIMARY KEY ("id")
      )
    `);
    }

    public async down(
        queryRunner: QueryRunner,
    ): Promise<void> {
        await queryRunner.query(`
      DROP TABLE IF EXISTS "videos"
    `);

        await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."videos_status_enum"
    `);
    }
}