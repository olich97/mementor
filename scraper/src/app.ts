import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { ScrapConfiguration } from './model/ScrapConfiguration';
import { IScraper, Scraper } from './services/Scrapper';

const scrapConfig: ScrapConfiguration = new ScrapConfiguration(
    process.env.SCRAP_TARGET_ELEMENT_PATTERN,
    process.env.SCRAP_TEXT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN_ATTR
);

const scraper: IScraper = new Scraper(scrapConfig);

(async () => {
    const start = performance.now();

    //const result: Meme[] = await scraper.scrap(process.env.SCRAP_TARGET);

    for (let pageNumber = 0; pageNumber < 6; pageNumber++) {
        const url: string = process.env.SCRAP_TARGET + '/' + pageNumber;
        console.log(`Scrapping url: ${url}`);
        const result: Meme[] = await scraper.scrap(url);
        console.log('Result: ');
        console.log(result);
        console.log('------------------');
    }

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
})();
