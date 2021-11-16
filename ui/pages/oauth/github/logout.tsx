import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Loader from '../../../components/Loader';
import { oAuthService } from '../../../lib/oAuthService';

export const Logout = (): JSX.Element => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setMessage] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    (async function () {
      //console.log(router.query.code);
      //console.log(params.code);
      setLoading(true);
      const { isError, errorMessage } = await oAuthService.logOut();
      setIsError(isError);
      setMessage(errorMessage);
      setLoading(false);
      if (!isError) {
        router.push('/');
      }
    })();
  }, []);

  return (
    <Layout
      customMeta={{
        title: 'Logout - Mementor',
      }}
    >
      {isLoading && <Loader />}
      {isError && <p>{errorMessage}</p>}
    </Layout>
  );
};

export default Logout;
