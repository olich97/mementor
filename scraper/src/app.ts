import 'reflect-metadata';
import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { ScrapConfiguration } from './model/ScrapConfiguration';
import { IScraper, Scraper } from './services/Scrapper';
import { createConnection } from 'typeorm';
import { ScrapError } from './model/ScrapError';

const scrapConfig: ScrapConfiguration = new ScrapConfiguration(
    process.env.SCRAP_TARGET_ELEMENT_PATTERN,
    process.env.SCRAP_TEXT_PATTERN,
    process.env.SCRAP_SOURCE_URL_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN_ATTR
);

const scraper: IScraper = new Scraper(scrapConfig);

(async () => {
    const start = performance.now();
    // create database connection
    const connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [`${__dirname}/model/*`]
    });
    const errorRepository = connection.getRepository(ScrapError);
    const memeRepository = connection.getRepository(Meme);
    //const result: Meme[] = await scraper.scrap(process.env.SCRAP_TARGET);

    for (let pageNumber = 0; pageNumber < 1; pageNumber++) {
        const url: string = process.env.SCRAP_TARGET + '/' + pageNumber;
        try {
            console.log(`Scrapping url: ${url}`);
            const memes: Meme[] = await scraper.scrap(url);
            console.log('Result: ');
            console.log(memes);
            console.log('------------------');
            memeRepository.save(memes);
        } catch (error) {
            errorRepository.save(ScrapError.Create(url, <string>error));
        }
    }

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
})();
