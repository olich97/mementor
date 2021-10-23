import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { ScrapConfiguration } from './model/ScrapConfiguration';
import { IScraper, Scraper } from './services/PageScrapper';

const scrapConfig: ScrapConfiguration = new ScrapConfiguration(
    process.env.SCRAP_TARGET_ELEMENT_PATTERN,
    process.env.SCRAP_TEXT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN_ATTR
);

const scraper: IScraper = new Scraper(scrapConfig);

(async () => {
    const start = performance.now();

    const result: Meme[] = await scraper.scrap(process.env.SCRAP_TARGET);

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
    console.log(result);
})();
