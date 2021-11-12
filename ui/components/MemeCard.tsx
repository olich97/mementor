import React from 'react';
import { MemeType } from '../types/meme';

const MemeCard = ({ meme }: { meme?: MemeType }): JSX.Element => {
  return (
    <div className="flow-root">
      <div className="box-border md:box-content">
        <header className=" text-xl font-extrabold py-4">{meme.text}</header>
        <img
          src={meme.content}
          alt={meme.code}
          className="w-full md:w-7/12 lg:w-9/12"
        />
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
