import https from 'https';

export class HttpRequestHelper {
    public static async getHtml(targetUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            https
                .get(targetUrl, (res) => {
                    let html = '';
                    res.on('data', function (chunk) {
                        html += chunk;
                    });
                    res.on('end', function () {
                        resolve(html);
                    });
                })
                .on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }
}
