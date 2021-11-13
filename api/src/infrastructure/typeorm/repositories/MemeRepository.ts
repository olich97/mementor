import { Meme } from "@/core/entities/Meme";
import { IMemeRepository } from "@/core/interfaces/repositories/IMemeRepository";
import { Connection, Like } from "typeorm";
import { Repository } from "typeorm/repository/Repository";
import { MemeMapping } from "../mappings/MemeMapping";

export class MemeRepository implements IMemeRepository {
    
    private _memes: Repository<Meme>;
    private _connection: Connection;
    constructor(databaseConnection: Connection) {
        this._connection = databaseConnection;
        this._memes = this._connection.getRepository<Meme>(MemeMapping);
    }

    async getByCode(code: string): Promise<Meme> {
        return await this._memes.findOne({ code: code });
    }

    async query(searchOptions: any): Promise<Meme[]> {
        let options: any = { 
            relations: ['content'],
            take: searchOptions.take || 10,
            skip: searchOptions.skip || 0
        };

        if(searchOptions.where) {
            //const operatorAndValue = searchOptions.where.operator === 'like' ?? Like(searchOptions.where.value);
            //const column =  searchOptions.where.column;
            options = {
                ...options,
                where: { text: Like(`%${searchOptions.where.value}%`) } // TODO: make more dynamic
            };
        }
        
        return await this._memes.find(options);
    }

    async getAll(): Promise<Meme[]> {
        return await this._memes.find({ relations: ['content'] });
    }

    async getById(id: string): Promise<Meme> {
        return await this._memes.findOne(id, { relations: ['content'] });
    }

    async add(entity: Meme): Promise<Meme> {
        return await this._memes.save(entity);
    }

    async update(entity: Meme): Promise<boolean> {
        const result = await this._memes.save(entity);
        return result !== undefined;
    }

    async delete(entity: Meme): Promise<boolean> {
        const result = await this._memes.delete(entity);        
        return result.affected !== 0;
    }
    
}