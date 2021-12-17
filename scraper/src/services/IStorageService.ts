export interface IStorageService {
    uploadFile(targetUrl: string, fileName: string): Promise<string>;
}
