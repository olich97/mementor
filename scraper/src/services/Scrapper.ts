import { Meme } from '../model/Meme';
import { HttpRequestHelper } from '../utils/HttpRequestHelper';
import cheerio from 'cheerio';
import mime from 'mime-types';
import { ScrapConfiguration } from '../model/ScrapConfiguration';
import crypto from 'crypto';
export interface IScraper {
    scrap(targetUrl: string): Promise<Meme[]>;
}

export class Scraper implements IScraper {
    private _config: ScrapConfiguration;

    constructor(config: ScrapConfiguration) {
        this._config = config;
    }

    async scrap(targetUrl: string): Promise<Meme[]> {
        if (!targetUrl) {
            throw Error(`Incorrect target url configuration: ${targetUrl}`);
        }
        const html: string = await HttpRequestHelper.getHtml(targetUrl);
        const $ = cheerio.load(html);

        const elements = $(this._config.targetElementPattern);

        if (elements.length == 0) {
            throw Error(
                `Enable to find target elements with pattern ${this._config.targetElementPattern}`
            );
        }

        const memes: Meme[] = [];

        const elementsArray = elements.toArray();

        for (let i = 0; i < elementsArray.length; i++) {
            try {
                const me = elementsArray[i];
                const text = $(me).find(this._config.textPattern).text().trim();
                const sourceUrl = $(me).find(this._config.sourceUrlPattern).attr('href').trim();
                const content = $(me).find(this._config.contentPattern);
                const contentUrl = content.attr(this._config.contentPatternAttribute);
                const contentType = mime.lookup(contentUrl);

                if (!text || text == '') {
                    console.error(
                        `Enable to find text with pattern ${this._config.textPattern} inside element with pattern ${this._config.targetElementPattern}`
                    );
                    return;
                }

                if (!contentUrl || contentUrl == '') {
                    console.error(
                        `Enable to find content with pattern ${this._config.contentPattern} and attribute ${this._config.contentPatternAttribute} inside element with pattern ${this._config.targetElementPattern}`
                    );
                    return;
                }
                // get hash of content file
                const fileBuffer = await HttpRequestHelper.getBufferFromUrl(sourceUrl);
                const hashSum = crypto.createHash('sha256');
                hashSum.update(fileBuffer);
                const contentHash = hashSum.digest('hex');
                const meme = Meme.Create(text, sourceUrl, contentType, contentUrl, contentHash);

                memes.push(meme);
            } catch (error) {
                console.warn(`Problem with processing element at position: ${i}`, error);
            }
        }

        return memes;
    }
}
