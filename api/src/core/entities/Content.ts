import { ContentType } from "../enums";
import { BaseEntity } from "./BaseEntity";
import {v4 as uuid} from 'uuid';

export class Content extends BaseEntity {    
    type: ContentType;
    sourceUrl?: string;
    storageKey: string;

    public static Create(
        type: ContentType,       
        storageKey: string,
        sourceUrl?: string
    ): Content {
        const content: Content = new Content();
        content.id = uuid(); 
        content.type = type;
        content.sourceUrl = sourceUrl;
        content.storageKey = storageKey;
        content.lastUpdateDate = new Date();

        return content;
    }
}
