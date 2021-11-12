import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAllMemes } from '../lib/api';
import MemeCard from '../components/MemeCard';
import Pagination from '../components/Pagination';

export const Index = (): JSX.Element => {
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = getAllMemes(['id', 'code', 'text', 'content']);
      setPosts(res);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts; //= posts.slice(indexOfFirstPost, indexOfLastPost);
  let filteredPosts = posts;
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // search handling
  if (searchValue.length > 0) {
    filteredPosts = posts.filter((item) =>
      item.text.toLowerCase().includes(searchValue.toLowerCase())
    );
    currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  } else {
    currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  }

  return (
    <Layout>
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mr-2 text-gray-600"
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
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-1/3 py-2 border-b-2 outline-none focus:border-green-400"
        />
      </div>
      <div className="space-y-4 divide-y md:divide-y-4">
        {currentPosts.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
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
