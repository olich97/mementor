import { SkynetClient } from '@skynetlabs/skynet-nodejs';
import { FileHelper } from '../utils/FileHelper';
import fs from 'fs';
import { IStorageService } from './IStorageService';
export class SkynetService implements IStorageService {
    private _authToken: string;
    private _localFileRepoPath: string;
    private _skynetPortal: string;
    private _skynetClient: SkynetClient;

    constructor(authToken: string, localFileRepoPath: string, skynetPortal: string) {
        this._authToken = authToken;
        this._localFileRepoPath = localFileRepoPath;
        this._skynetPortal = skynetPortal;

        this._skynetClient = new SkynetClient(this._skynetPortal, {
            customCookie: `skynet-jwt=${this._authToken}`
        });

        if (!fs.existsSync(this._localFileRepoPath)) {
            // Create the directory if it does not exist
            fs.mkdirSync(this._localFileRepoPath, { recursive: true });
        }
    }

    async uploadFile(targetUrl: string, fileName: string): Promise<string> {
        try {
            // need to be uploaded to external storage
            const file = await FileHelper.downloadFile(
                targetUrl,
                this._localFileRepoPath,
                fileName
            );
            const skylink = await this._skynetClient.uploadFile(file);
            // delete file
            fs.unlinkSync(file);

            return skylink.replace('sia://', '');
        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }
}
