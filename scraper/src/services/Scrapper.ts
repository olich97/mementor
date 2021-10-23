import { Meme, ContentType } from '../model/Meme';
import { HttpRequestHelper } from '../utils/HttpRequestHelper';
import cheerio from 'cheerio';
import mime from 'mime-types';
import { ScrapConfiguration } from '../model/ScrapConfiguration';

export interface IScraper {
    scrap(targetUrl: string): Promise<Meme[]>;
}

export class Scraper implements IScraper {
    private _config: ScrapConfiguration;

    constructor(config: ScrapConfiguration) {
        this._config = config;
    }

    async scrap(targetUrl: string): Promise<Meme[]> {
        try {
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

            elements.each((index, me) => {
                const text = $(me).find(this._config.textPattern).text().trim();
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

                const meme: Meme = {
                    text: text,
                    content: { url: contentUrl, type: contentType as ContentType },
                    sourceUrl: '',
                    metaData: ''
                };

                memes.push(meme);
            });

            return memes;
        } catch (err) {
            console.error(err);
        }
    }
}
