import { IStorageService } from '@/core/interfaces/services/IStorageService';
import config from './AppSettings';
export class StorageService implements IStorageService {
  async getUrl(key: string): Promise<string> {
    return `${config.storage.url}/${key}`;
  }
}
