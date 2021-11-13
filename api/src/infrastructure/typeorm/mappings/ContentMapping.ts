import { Content } from "@/core/entities/Content";
import { EntitySchema } from "typeorm";

export const ContentMapping = new EntitySchema<Content>({
    name: "Content",
    tableName: 'content',
    columns: {
        id: {
            type: String,
            primary: true,
            name: 'content_id'
        },
        type: {
            type: String,
            length: 19
        },
        sourceUrl: {
            type: String,
            name: 'source_url'
        },
        storageKey: {
            type: String,
            length: 64,
            name: 'storage_key'
        },       
        lastUpdateDate: {
            type: Date,
            name: 'last_update_date'
        }
    }
});