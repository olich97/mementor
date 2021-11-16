import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { oAuthService } from '../lib/oAuthService';

const Navigation = (): JSX.Element => {
  const [providerLoginUrl, setProviderUrl] = useState();
  useEffect(() => {
    (async function () {
      const url = await oAuthService.getProviderLoginUrl();

      setProviderUrl(url);
    })();
  }, []);

  return (
    <nav>
      <Link href="/">
        <a className="text-gray-900 dark:text-white pr-6 py-4">Home</a>
      </Link>
      <Link href="/about">
        <a className="text-gray-900 dark:text-white px-6 py-4">About</a>
      </Link>

      <a href={providerLoginUrl} className="text-gray-900 dark:text-white px-6 py-4">
        Login With GitHub
      </a>
    </nav>
  );
};

export default Navigation;
