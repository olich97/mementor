import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { IScraper, Scraper } from './services/Scraper';

const scraper: IScraper = new Scraper();

(async () => {
    const start = performance.now();

    const result: Meme = await scraper.scrapSingle(
        process.env.SCRAP_TARGET,
        process.env.SCRAP_TEXT_PATTERN,
        process.env.SCRAP_CONTENT_PATTERN,
        process.env.SCRAP_CONTENT_PATTERN_ATTR
    );

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
    console.log(result);
})();
