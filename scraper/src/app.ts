import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { SingleScrapConfiguration } from './model/SingleScrapConfiguration';
import { ISingleScraper, SingleScraper } from './services/SingleScraper';

const singleScraperConfig: SingleScrapConfiguration = new SingleScrapConfiguration(
    process.env.SCRAP_TARGET,
    process.env.SCRAP_TARGET_ELEMENT_PATTERN,
    process.env.SCRAP_TEXT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN_ATTR
);

const scraper: ISingleScraper = new SingleScraper(singleScraperConfig);

(async () => {
    const start = performance.now();

    const result: Meme = await scraper.scrap();

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
    console.log(result);
})();
