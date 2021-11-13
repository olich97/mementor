import { Meme } from "@/core/entities/Meme";
import { EntitySchema, EntitySchemaRelationOptions } from "typeorm";

export const MemeMapping = new EntitySchema<Meme>({
    name: "Meme",
    tableName: 'meme',
    columns: {
        id: {
            type: String,
            primary: true,
            name: 'meme_id'
        }, 
        code: {
            type: String
        },
        text: {
            type: String
        },
        sourceUrl: {
            type: String,
            name: 'source_url'
        },
        isPublic: {
            type: Boolean,
            name: 'is_public'
        },
        publishDate: {
            type: Date,
            name: 'publish_date'
        },
        lastUpdateDate: {
            type: Date,
            name: 'last_update_date',
            updateDate: true
        },
        content: {
            type: String,
            name: 'content_id'
        }
    },
    relations: {
        content: {
            type: 'one-to-one',
            target: 'Content',
            joinTable: 'content',
            joinColumn: {
                name: 'content_id'
            },
            primary: true,
            cascade: true
        } as EntitySchemaRelationOptions
    }
});