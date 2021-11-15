import useSWR from 'swr';
import { MemeType } from '../types/meme';
import config from './config';

export type MemeOutput = {
  memes?: MemeType[];
  meme?: MemeType;
  isLoading: boolean;
  isError: boolean;
};

const fetcher = async url => {
  //https://swr.vercel.app/docs/error-handling
  const response = await (await fetch(url)).json();

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!response.isSuccess) {
    throw new Error(`An error occurred while fetching the data: ${response.errors}`);
  }

  return response.data;
};

export function getMemes(limit: number, skip: number, search: string): MemeOutput {
  const searchQuery = search !== '' ? `search=${search}` : '';
  const { data, error } = useSWR(`${config.MEMES_ENDPOINT}?take=${limit}&skip=${skip}&${searchQuery}`, fetcher);

  return {
    memes: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function getMemeByCode(code: string): MemeOutput {
  const { data, error } = useSWR(`${config.MEMES_ENDPOINT}/${code}`, fetcher);

  return {
    meme: data,
    isLoading: !error && !data,
    isError: error,
  };
}
