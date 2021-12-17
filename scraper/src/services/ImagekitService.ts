import ImageKit from 'imagekit';
import fs from 'fs';
import { FileHelper } from '../utils/FileHelper';
import { IStorageService } from './IStorageService';

export class ImagekitService implements IStorageService {
    private _publicKey: string;
    private _privateKey: string;
    private _endpointUrl: string;
    private _localFileRepoPath: string;
    private _client: ImageKit;

    constructor(
        publicKey: string,
        privateKey: string,
        localFileRepoPath: string,
        endpoint: string
    ) {
        this._publicKey = publicKey;
        this._privateKey = privateKey;
        this._localFileRepoPath = localFileRepoPath;
        this._endpointUrl = endpoint;

        this._client = new ImageKit({
            publicKey: this._publicKey,
            privateKey: this._privateKey,
            urlEndpoint: this._endpointUrl
        });

        if (!fs.existsSync(this._localFileRepoPath)) {
            // Create the directory if it does not exist
            fs.mkdirSync(this._localFileRepoPath, { recursive: true });
        }
    }

    async uploadFile(targetUrl: string, fileName: string): Promise<string> {
        try {
            // download target file locally
            //const file = await FileHelper.downloadFile(
            //    targetUrl,
            //    this._localFileRepoPath,
            //    fileName
            //);
            // upload file to external storage
            const response = await this._client.upload({
                file: targetUrl, //required
                fileName: fileName //required
            });
            // delete file
            //fs.unlinkSync(file);

            return response.name;
        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }
}
