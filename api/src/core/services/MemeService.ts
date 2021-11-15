import { Meme } from '../entities/Meme';
import { IMemeRepository } from '../interfaces/repositories/IMemeRepository';
import { IMemeService } from '../interfaces/services/IMemeService';
import { IStorageService } from '../interfaces/services/IStorageService';
import { CreateMemeInput } from '../interfaces/services/models/CreateMemeInput';
import { MemeOutput } from '../interfaces/services/models/MemeOutput';
export class MemeService implements IMemeService {
  private readonly _memes: IMemeRepository;
  private readonly _storage: IStorageService;

  constructor(memeRepository: IMemeRepository, storageService: IStorageService) {
    this._memes = memeRepository;
    this._storage = storageService;
  }

  public async getByCode(code: string): Promise<MemeOutput> {
    const meme = await this._memes.getByCode(code);
    if (!meme) {
      // TODO: implement ItemNotFound error
      throw new Error('Item not found');
    }
    return await this.memeToOutput(meme);
  }

  public async list(skip: number = 0, limit: number = 0): Promise<MemeOutput[]> {
    const memes = await this._memes.query({ skip: skip, take: limit });

    return await this.memesToOutput(memes);
  }

  public async searchByText(skip: number = 0, limit: number = 0, text: string): Promise<MemeOutput[]> {
    const memes = await this._memes.query({
      skip: skip,
      take: limit,
      where: { column: 'text', operator: 'like', value: text },
    });

    return await this.memesToOutput(memes);
  }

  public async create(resource: CreateMemeInput): Promise<MemeOutput> {
    throw new Error('Method not implemented.');
    // https://github.dev/cornflourblue/node-mysql-signup-verification-api
  }

  private async memesToOutput(memes: Meme[]): Promise<MemeOutput[]> {
    return Promise.all(memes.map(async meme => this.memeToOutput(meme)));
  }

  private async memeToOutput(meme: Meme): Promise<MemeOutput> {
    const contentUrl = await this._storage.getUrl(meme.content.storageKey);
    return {
      id: meme.id,
      code: meme.code,
      sourceUrl: meme.sourceUrl,
      text: meme.text,
      author: meme.author,
      isPublic: meme.isPublic,
      publishDate: meme.publishDate,
      contentUrl: contentUrl,
      contentType: meme.content.type,
    };
  }
}
