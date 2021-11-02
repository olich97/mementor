import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'scrap_error' })
export class ScrapError {
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
        const scrapError = new ScrapError();
        scrapError.attempts = 0;
        scrapError.targetUrl = sourceUrl;
        scrapError.error = errorMessage;
        return scrapError;
    }
}
