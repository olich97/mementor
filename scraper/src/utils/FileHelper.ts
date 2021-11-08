import https from 'https';
import fs from 'fs';
import path from 'path';

export class FileHelper {
    /**
     * Download a resource from `url` to `destination folder` with given file name.
     * @param {string} targetUrl - Valid URL to attempt download of resource
     * @param {string} destinationFolder - Valid path to save the file.
     * @param {string} fleName - A name for the file
     * @returns {Promise<string>} - Returns a complete file path asynchronously when successfully completed download
     */
    public static downloadFile(
        targetUrl: string,
        destinationFolder: string,
        fleName: string
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const completeFilePath = path.join(destinationFolder, fleName);
            // Check file does not exist yet before hitting network
            fs.access(completeFilePath, fs.constants.F_OK, (err) => {
                if (err === null) reject('File already exists');

                const request = https.get(targetUrl, (response) => {
                    if (response.statusCode === 200) {
                        const file = fs.createWriteStream(completeFilePath, { flags: 'wx' });
                        file.on('finish', () => resolve(completeFilePath));
                        file.on('error', (err: any) => {
                            file.close();
                            if (err.code === 'EEXIST') reject('File already exists');
                            else fs.unlink(completeFilePath, () => reject(err.message)); // Delete temp file
                        });
                        response.pipe(file);
                    } else if (response.statusCode === 302 || response.statusCode === 301) {
                        //Recursively follow redirects, only a 200 will resolve.
                        this.downloadFile(
                            response.headers.location,
                            destinationFolder,
                            fleName
                        ).then((filePath) => resolve(filePath));
                    } else {
                        reject(
                            `Server responded with ${response.statusCode}: ${response.statusMessage}`
                        );
                    }
                });

                request.on('error', (err) => {
                    reject(err.message);
                });
            });
        });
    }
}
