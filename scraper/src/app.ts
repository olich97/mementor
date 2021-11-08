import 'reflect-metadata';
import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { ScrapConfiguration } from './model/ScrapConfiguration';
import { IScraper, Scraper } from './services/Scrapper';
import { createConnection, Repository } from 'typeorm';
import { ScrapError } from './model/ScrapError';
import { ISkynetService, SkynetService } from './services/SkynetService';

const scrapConfig: ScrapConfiguration = new ScrapConfiguration(
    process.env.SCRAP_TARGET_ELEMENT_PATTERN,
    process.env.SCRAP_TEXT_PATTERN,
    process.env.SCRAP_SOURCE_URL_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN,
    process.env.SCRAP_CONTENT_PATTERN_ATTR
);

const scraper: IScraper = new Scraper(scrapConfig);
const skynet: ISkynetService = new SkynetService(
    process.env.SKY_AUTH_TOKEN,
    process.env.SKY_LOCAL_FILE_REPO,
    process.env.SKY_PORTAL_URL
);

let errorRepository: Repository<ScrapError>;
let memeRepository: Repository<Meme>;

async function inizializeDatabase() {
    const connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [`${__dirname}/model/*`]
    });
    errorRepository = connection.getRepository(ScrapError);
    memeRepository = connection.getRepository(Meme);
}

(async () => {
    const start = performance.now();
    // create database connection
    await inizializeDatabase();

    for (let pageNumber = 1; pageNumber < 30; pageNumber++) {
        const url: string = process.env.SCRAP_TARGET + '/' + pageNumber;
        try {
            console.log(`Scrapping url: ${url}`);
            const memes: Meme[] = await scraper.scrap(url);
            console.log('Scrapping complete');
            //console.log(memes);
            console.log('------------------');
            for (let i = 0; i < memes.length; i++) {
                const newMeme = memes[i];
                const result = await memeRepository.findOne({ code: newMeme.code });
                //console.log('Result ', result);
                if (!result) {
                    // need to check if there already exist content to associate meme with
                    const existingMemeContent = await memeRepository.findOne({
                        relations: ['content'],
                        where: {
                            content: {
                                hash: newMeme.content.hash
                            }
                        }
                    });
                    if (existingMemeContent) {
                        // just map map content to new meme
                        newMeme.content = existingMemeContent.content;
                    } else {
                        // need to be uploaded to external storage
                        const fileName = newMeme.content.sourceUrl.substring(
                            newMeme.content.sourceUrl.lastIndexOf('/') + 1
                        );
                        const skyKey = await skynet.uploadFile(newMeme.content.sourceUrl, fileName);
                        console.log(`Upload successful, skylink: ${skyKey}`);
                        newMeme.content.storageKey = skyKey;
                    }
                    memeRepository.save(newMeme);
                    console.log('Saved: ', newMeme);
                }
            }
        } catch (error) {
            console.error(error);
            errorRepository.save(ScrapError.Create(url, <string>error));
        }
    }

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms (${(end - start) / 1000} s)`);
})();

function toArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
