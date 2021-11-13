import { IMemeRepository } from "../interfaces/repositories/IMemeRepository";
import { IMemeService } from "../interfaces/services/IMemeService";
import { IStorageService } from "../interfaces/services/IStorageService";
import { CreateMemeInput } from "../interfaces/services/models/CreateMemeInput";
import { MemeOutput } from "../interfaces/services/models/MemeOutput";
export class MemeService implements IMemeService {
    private readonly _memes: IMemeRepository;
    private readonly _storage: IStorageService;

    constructor(memeRepository: IMemeRepository, storageService: IStorageService) {
        this._memes = memeRepository;
        this._storage = storageService;
    } 
   
    public async list(skip: number = 0, limit: number = 0): Promise<MemeOutput[]> {
        const memes = await this._memes.query({ skip: skip, take: limit });

        //TODO: move to some cast method
        return Promise.all(memes.map(async (meme) => ({
            id: meme.id,
            code: meme.code,
            sourceUrl: meme.sourceUrl,
            text: meme.text,
            author: meme.author,
            isPublic: meme.isPublic,
            publishDate: meme.publishDate,
            contentUrl: await this._storage.getUrl(meme.content.storageKey),
            contentType: meme.content.type
        })));
    }

    public async searchByText(skip: number = 0, limit: number = 0, text: string): Promise<MemeOutput[]> {
        const memes = await this._memes.query({ skip: skip, take: limit, 
            where: { column: 'text',  operator: 'like', value: text }                  
          });

        //TODO: move to some cast method
        return Promise.all(memes.map(async (meme) => ({
            id: meme.id,
            code: meme.code,
            sourceUrl: meme.sourceUrl,
            text: meme.text,
            author: meme.author,
            isPublic: meme.isPublic,
            publishDate: meme.publishDate,
            contentUrl: await this._storage.getUrl(meme.content.storageKey),
            contentType: meme.content.type
        })));
    }

    public async create(resource: CreateMemeInput) : Promise<MemeOutput> {
        throw new Error("Method not implemented.");
    }
}