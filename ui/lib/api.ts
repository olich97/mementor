import memes from '../data/memes.json';

type MemeItems = {
  [key: string]: string;
};

// TODO: https://nextjs.org/docs/basic-features/data-fetching

export function getAllMemes(fields: string[] = []): MemeItems[] {
  const result = memes.map((meme) => {
    const items: MemeItems = {};
    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      if (meme[field]) {
        items[field] = meme[field];
      }
    });

    return items;
  });

  //console.log(result);
  return result;
}
