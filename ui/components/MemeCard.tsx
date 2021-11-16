import Link from 'next/link';
import React from 'react';
import { MemeType } from '../types/meme';

const MemeCard = ({ meme }: { meme?: MemeType }): JSX.Element => {
  return (
    <div className="flow-root">
      <div className="box-border md:box-content">
        <div>
          <Link href={{ pathname: '/memes/[code]', query: { code: meme.code } }}>
            <header className="cursor-pointer text-xl font-extrabold py-4">{meme.text}</header>
          </Link>
          <Link href={{ pathname: '/memes/[code]', query: { code: meme.code } }}>
            <img src={meme.contentUrl} alt={meme.code} className="w-full md:w-7/12 lg:w-9/12 cursor-pointer" />
          </Link>
        </div>

        <footer className="text-right px-1 text-gray-500" hidden>
          <button className="py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600">
            GET STARTED
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MemeCard;
