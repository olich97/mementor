import axios from 'axios';
import cheerio from 'cheerio';
import { Meme } from '../model/Meme';

export interface IScraper {
    scrapSingle(
        targetUrl: string,
        textPatern: string,
        contentPattern: string,
        contentPatternAttribute: string
    ): Promise<Meme>;
    scrapPages(
        targetUrl: string,
        textPatern: string,
        contentPattern: string,
        contentPatternAttribute: string,
        startPage: number,
        endPage: number
    ): Promise<Meme[]>;
}

export class Scraper implements IScraper {
    async scrapSingle(
        targetUrl: string,
        textPatern: string,
        contentPattern: string,
        contentPatternAttribute: string
    ): Promise<Meme> {
        try {
            const html: string = <string>await (await axios.get(targetUrl)).data;
            const $ = cheerio.load(html);

            const text = $(textPatern).text();
            const contentUrl = $(contentPattern).attr(contentPatternAttribute);

            if (!text || text == '') {
                throw Error(`Enable to find text with pattern ${textPatern}`);
            }

            if (!contentUrl || contentUrl == '') {
                throw Error(
                    `Enable to find content with pattern ${contentPattern} and attribute ${contentPatternAttribute}`
                );
            }

            return Meme.Create(text, contentUrl);
        } catch (err) {
            console.error(err);
        }
    }
    async scrapPages(
        targetUrl: string,
        textPatern: string,
        contentPattern: string,
        constentPatternAttribute: string,
        startPage: number,
        endPage: number
    ): Promise<Meme[]> {
        throw new Error('Method not implemented.');
    }
}
