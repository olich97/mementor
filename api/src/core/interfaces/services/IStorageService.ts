
export interface IStorageService {
    getUrl(key: string): Promise<string>;
}
