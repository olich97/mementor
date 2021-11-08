import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'content_upload_error' })
export class UploadError {
    @PrimaryGeneratedColumn('uuid', { name: 'error_id' })
    id: string;

    @Column({ type: 'text', name: 'target_url' })
    targetUrl: string;

    @Column({ type: 'int' })
    attempts: number;

    @Column({ type: 'text' })
    error: string;

    @Column({ type: 'timestamp', name: 'last_update_date' })
    lastUpdateDate?: Date;

    public static Create(sourceUrl: string, errorMessage: string) {
        const uploadError = new UploadError();
        uploadError.attempts = 0;
        uploadError.targetUrl = sourceUrl;
        uploadError.error = errorMessage;
        return uploadError;
    }
}
