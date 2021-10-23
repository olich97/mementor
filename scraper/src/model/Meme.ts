export enum ContentType {
    gif = 'image/gif',
    mp4 = 'video/mp4',
    webm = 'video/webm'
}

interface Content {
    url: string;
    type: ContentType;
}

export interface Meme {
    /**
     * The meme main text or title
     */
    text: string;
    /**
     * Content associated to the meme (gif, mp4 ecc..)
     */
    content: Content;
    /**
     * Source main location url of the meme post
     */
    sourceUrl: string;
    /**
     * Some additional data for the meme
     */
    metaData: string;
}
