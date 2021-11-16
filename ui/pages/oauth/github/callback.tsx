import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Loader from '../../../components/Loader';
import { oAuthService } from '../../../lib/oAuthService';

export function getServerSideProps({ query }) {
  return {
    props: { params: query },
  };
}

export const Callback = ({ params }): JSX.Element => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setMessage] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    (async function () {
      //console.log(router.query.code);
      //console.log(params.code);
      if (params.code) {
        setLoading(true);
        const { isError, errorMessage } = await oAuthService.loginWithGithub(params.code.toString());
        setIsError(isError);
        setMessage(errorMessage);
        setLoading(false);
        if (!isError) {
          router.push('/');
        }
      }
    })();
  }, []);

  return (
    <Layout
      customMeta={{
        title: 'Callback - Mementor',
      }}
    >
      {isLoading && <Loader />}
      {isError && <p>{errorMessage}</p>}
    </Layout>
  );
};

export default Callback;
