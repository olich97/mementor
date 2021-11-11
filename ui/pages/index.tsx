import { GetStaticProps } from 'next';
import React from 'react';
import Layout from '../components/Layout';
import { getAllMemes } from '../lib/api';
import { MemeType } from '../types/meme';
import MemeCard from '../components/MemeCard';

type IndexProps = {
  memes: MemeType[];
};

export const Index = ({ memes }: IndexProps): JSX.Element => {
  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const memes = getAllMemes(['id', 'code', 'text', 'content']);
  //console.log(memes);
  return {
    props: { memes },
  };
};

export default Index;
