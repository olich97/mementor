import { BaseEntity } from './BaseEntity';
import { Content } from './Content';
import { v4 as uuid } from 'uuid';
import { ContentType } from '../enums';

export class Meme extends BaseEntity {
  code: string;
  sourceUrl: string;
  text: string;
  author: string;
  isPublic: boolean;
  publishDate?: Date;
  content: Content;

  public static Create(
    memeText: string,
    memeSourceUrl: string,
    contentType: ContentType,
    contentSourceUrl: string,
    contentStorageKey: string,
  ): Meme {
    const content = Content.Create(contentType, contentStorageKey, contentSourceUrl);

    const meme = new Meme();
    meme.id = uuid();
    meme.text = memeText;
    meme.sourceUrl = memeSourceUrl;
    meme.code = memeText.replace(/\s/g, '-').toLowerCase();
    meme.content = content;

    return meme;
  }
}
