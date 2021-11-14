import { IStorageService } from '@/core/interfaces/services/IStorageService';

export class StorageService implements IStorageService {
  async getUrl(key: string): Promise<string> {
    return `https://siasky.net/${key}`;
  }
}
