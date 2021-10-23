import cheerio from 'cheerio';
import { ContentType, Meme } from '../model/Meme';
import { SingleScrapConfiguration } from '../model/SingleScrapConfiguration';
import { HttpRequestHelper } from '../utils/HttpRequestHelper';
import mime from 'mime-types';

export interface ISingleScraper {
    scrap(): Promise<Meme>;
}

export class SingleScraper implements ISingleScraper {
    private _config: SingleScrapConfiguration;

    constructor(config: SingleScrapConfiguration) {
        this._config = config;
        if (!this._config.targetUrl) {
            throw Error(`Incorrect target url configuration: ${this._config.targetUrl}`);
        }
    }

    async scrap(): Promise<Meme> {
        try {
            const html: string = await HttpRequestHelper.getHtml(this._config.targetUrl);
            const $ = cheerio.load(html);

            const element = $(this._config.targetElementPattern);

            if (!element) {
                throw Error(
                    `Enable to find element with pattern ${this._config.targetElementPattern}`
                );
            }

            const text = element.find(this._config.textPattern).text();
            const content = element.find(this._config.contentPattern);
            const contentUrl = content.attr(this._config.contentPatternAttribute);
            const contentType = mime.lookup(contentUrl);
            //const contentType = content.attr('type');

            if (!text || text == '') {
                throw Error(
                    `Enable to find text with pattern ${this._config.textPattern} inside element with pattern ${this._config.targetElementPattern}`
                );
            }

            if (!contentUrl || contentUrl == '') {
                throw Error(
                    `Enable to find content with pattern ${this._config.contentPattern} and attribute ${this._config.contentPatternAttribute} inside element with pattern ${this._config.targetElementPattern}`
                );
            }

            return {
                text: text,
                content: { url: contentUrl, type: contentType as ContentType },
                sourceUrl: '',
                metaData: ''
            };
        } catch (err) {
            console.error(err);
        }
    }
}
