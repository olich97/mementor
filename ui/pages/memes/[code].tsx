import { format } from 'date-fns';
import React from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import { getMemeByCode } from '../../lib/swrMemeService';
import { MetaProps } from '../../types/layout';

export function getServerSideProps(context: any) {
  return {
    props: { params: context.params },
  };
}

const MemePage = ({ params }): JSX.Element => {
  const { code } = params;
  const { meme, isLoading, isError } = getMemeByCode(code.toString());

  const customMeta: MetaProps = {
    title: `${meme?.text} - Mementor`,
    description: meme?.text,
    image: meme?.contentUrl,
    date: meme?.publishDate,
    type: 'article',
  };
  return (
    <Layout customMeta={customMeta}>
      {isLoading && <Loader />}
      {isError && <div>failed to load</div>}
      {meme && (
        <article>
          <h1 className="mb-3 text-gray-900 dark:text-white">{meme.text}</h1>
          <p className="mb-10 text-sm text-gray-500 dark:text-gray-400">
            {meme.publishDate && format(meme.publishDate, 'MMMM dd, yyyy')}
          </p>
          <img src={meme.contentUrl} alt={meme.code} className="w-full" />
        </article>
      )}
    </Layout>
  );
};

export default MemePage;
