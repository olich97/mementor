import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ContentType {
    GIF = 'image/gif',
    MP4 = 'video/mp4',
    WEBM = 'video/webm'
}

@Entity({ name: 'content' })
export class Content {
    @PrimaryGeneratedColumn('uuid', { name: 'content_id' })
    id: string;

    @Column({
        type: 'enum',
        enum: ContentType,
        default: ContentType.GIF
    })
    type: ContentType;

    @Column({ type: 'text', name: 'source_url' })
    sourceUrl: string;

    @Column({ type: 'varchar', name: 'storage_key', length: 64 })
    storageKey: string;

    @Column({ type: 'varchar', name: 'hash', length: 64 })
    hash: string;

    @Column({ name: 'last_update_date', type: 'timestamp' })
    lastUpdateDate?: Date;
}
