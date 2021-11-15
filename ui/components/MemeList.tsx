import React, { useState } from 'react';
import useSWR from 'swr';
import MemeCard from './MemeCard';

const fetcher = async (url) => {
  //https://swr.vercel.app/docs/error-handling
  const response = await (await fetch(url)).json();

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!response.isSuccess) {
    throw new Error(
      `An error occurred while fetching the data: ${response.errors}`
    );
  }

  return response.data;
};

function useMemes(limit, skip, search) {
  const searchQuery = search !== '' ? `search=${search}` : '';
  const { data, error } = useSWR(
    `http://localhost:3500/memes?take=${limit}&skip=${skip}&${searchQuery}`,
    fetcher
  );

  return {
    memes: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const MemeList = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');

  const nextPage = () => {
    setSkip(skip + limit);
  };

  const previousPage = () => {
    if (skip > 0) setSkip(skip - limit);
  };

  //console.log(`search: ${search}, skip: ${skip}, limit: ${limit}`);
  const { memes, isLoading, isError } = useMemes(limit, skip, search);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mr-2 text-black dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          name="Meme"
          autoFocus
          placeholder="Search memes .... "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 border-b-2 outline-none text-black focus:border-black dark:focus:border-white dark:bg-black dark:text-white"
        />
      </div>
      <div className="space-y-4 divide-y md:divide-y-4">
        {memes?.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>

      <nav aria-label="Page navigation" className="py-10">
        {skip > 0 && (
          <button
            className="h-10 px-10 text-black dark:text-white transition-colors duration-150 border focus:shadow-outline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            onClick={previousPage}
          >
            Previous
          </button>
        )}
        <button
          className="h-10 px-10 text-black dark:text-white transition-colors duration-150 border focus:shadow-outline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black float-right"
          onClick={nextPage}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default MemeList;
