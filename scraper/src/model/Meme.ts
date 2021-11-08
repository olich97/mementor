import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Content, ContentType } from './Content';

@Entity({ name: 'meme' })
export class Meme {
    @PrimaryGeneratedColumn('uuid', { name: 'meme_id' })
    id: string;

    @Column({ type: 'text' })
    code: string;

    @Column({ name: 'source_url', type: 'text' })
    sourceUrl: string;

    @Column({ type: 'text' })
    text: string;

    @Column({ type: 'varchar', length: 255 })
    author: string;

    @Column({ type: 'bit', name: 'is_public' })
    isPublic: boolean;

    @Column({ type: 'timestamp', name: 'publish_date' })
    publishDate?: Date;

    @Column({ type: 'int', name: 'likes_count' })
    likes: number;

    @OneToOne(() => Content, { cascade: true })
    @JoinColumn({ name: 'content_id' })
    content: Content;

    @Column({ type: 'timestamp', name: 'last_update_date' })
    lastUpdateDate?: Date;

    public static Create(
        memeText: string,
        memeSourceUrl: string,
        memeContentType: ContentType,
        contentSourceUrl: string,
        contentHash: string
    ): Meme {
        const memeContent: Content = new Content();
        memeContent.type = memeContentType;
        memeContent.sourceUrl = contentSourceUrl;
        memeContent.hash = contentHash;

        const meme = new Meme();
        meme.text = memeText;
        meme.content = memeContent;
        meme.sourceUrl = memeSourceUrl;
        meme.code = memeText.replace(/\s/g, '-').toLowerCase();

        return meme;
    }
}
