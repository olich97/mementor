import React from 'react';
import { MemeType } from '../types/meme';

const MemeCard = ({ meme }: { meme?: MemeType }): JSX.Element => {
  return (
    <div className="rounded-lg shadow-xl">
      <header className=" text-xl font-extrabold p-4">{meme.text}</header>
      <img src={meme.content} alt={meme.code} className="w-full object-cover" />
      <br></br>
      <footer className="text-right py-3 px-8 text-gray-500">
        <button className="py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600">
          GET STARTED
        </button>
      </footer>
    </div>
  );
};

export default MemeCard;
