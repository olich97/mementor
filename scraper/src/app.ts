import 'reflect-metadata';
import { performance } from 'perf_hooks';
import { Meme } from './model/Meme';
import { ScrapConfiguration } from './model/ScrapConfiguration';
import { IScraper, Scraper } from './services/Scrapper';
import { createConnection, Repository } from 'typeorm';
import { ScrapError } from './model/ScrapError';
import { ISkynetService, SkynetService } from './services/SkynetService';
import { Content } from './model/Content';
import { UploadError } from './model/UploadError';

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
let contentRepository: Repository<Content>;
let uploadErrorRepository: Repository<UploadError>;

async function inizializeDatabase() {
    const connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [`${__dirname}/model/*`]
    });
    errorRepository = connection.getRepository(ScrapError);
    memeRepository = connection.getRepository(Meme);
    contentRepository = connection.getRepository(Content);
    uploadErrorRepository = connection.getRepository(UploadError);
}

async function elaboratePage(url: string) {
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
                }
                memeRepository.save(newMeme);
                console.log('Saved: ', newMeme);
            }
        }
    } catch (error) {
        errorRepository.save(ScrapError.Create(url, <string>error));
        console.error(error);
    }
}

async function uploadFiles() {
    const startUpload = performance.now();

    const contentsToUpload = await contentRepository.find({ storageKey: null });

    for (let i = 0; i < contentsToUpload.length; i++) {
        const content = contentsToUpload[i];
        try {
            console.log(`Start uploading content: ${content.sourceUrl}`);
            const fileName = content.sourceUrl.substring(content.sourceUrl.lastIndexOf('/') + 1);
            const skyKey = await skynet.uploadFile(content.sourceUrl, fileName);
            console.log(`Upload successful, skylink: ${skyKey}`);
            content.storageKey = skyKey;
            contentRepository.save(content);
        } catch (error) {
            uploadErrorRepository.save(UploadError.Create(content.sourceUrl, <string>error));
            console.error(error);
        }
    }

    const endUpload = performance.now();
    const diff = endUpload - startUpload;
    console.log(
        `Upload files ${contentsToUpload.length} execution time: ${diff} ms (${diff / 1000} s)`
    );
}

async function elaborateMultiplePages(start: number, end: number) {
    console.log(`Start scrapping data from page ${start} to page ${end}`);
    const startScrap = performance.now();
    for (let currentPage = start; currentPage < end; currentPage++) {
        const url: string = process.env.SCRAP_TARGET + '/' + currentPage;
        await elaboratePage(url);
    }
    const endScrap = performance.now();
    const diff = endScrap - startScrap;
    console.log(`Scrap pages (${end - start}) execution time: ${diff} ms (${diff / 1000} s)`);
}

(async () => {
    // create database connection
    await inizializeDatabase();

    // Scraping pages
    await elaborateMultiplePages(
        parseInt(process.env.SCRAP_START_PAGE),
        parseInt(process.env.SCRAP_END_PAGE)
    );

    // Uploading files
    await uploadFiles();
})();
