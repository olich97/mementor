import { IMemeRepository } from "../interfaces/repositories/IMemeRepository";
import { IMemeService } from "../interfaces/services/IMemeService";
import { IStorageService } from "../interfaces/services/IStorageService";
import { CreateMemeInput } from "../interfaces/services/models/CreateMemeInput";
import { MemeOutput } from "../interfaces/services/models/MemeOutput";
import { UpdateMemeInput } from "../interfaces/services/models/UpdateMemeInput";

export class MemeService implements IMemeService {
    private readonly _memes: IMemeRepository;
    private readonly _storage: IStorageService;

    constructor(memeRepository: IMemeRepository, storageService: IStorageService) {
        this._memes = memeRepository;
        this._storage = storageService;
    } 
   
    public async list(limit: number, page: number): Promise<MemeOutput[]> {
        const memes = await this._memes.query({ skip: (page - 1) * limit, take: limit });

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
    };

    search(options: any): Promise<MemeOutput[]> {
        throw new Error("Method not implemented.");
    }

    public async create(resource: CreateMemeInput) : Promise<MemeOutput> {
        throw new Error("Method not implemented.");
    };

    public async update(id: string, resource: UpdateMemeInput): Promise<void> {
        throw new Error("Method not implemented.");
    };
 
    public async publish(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}