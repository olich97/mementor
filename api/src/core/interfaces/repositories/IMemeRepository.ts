
import { Meme } from "@/core/entities/Meme";
import { IRepository } from "./IRepository";

export interface IMemeRepository extends IRepository<Meme> {
    getByCode(code: string): Promise<Meme | undefined>;
    query(searchOptions: any): Promise<Meme[]>;
}
