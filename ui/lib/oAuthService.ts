import config from './config';

export const oAuthService = {
  getProviderLoginUrl,
  loginWithGithub,
  logOut,
  get loggedUser() {
    return JSON.parse(localStorage.getItem('user'));
  },
};

async function getProviderLoginUrl(): Promise<any> {
  const res = await fetch(`${config.OAUTH_ENDPOINT}/github/login_url`);

  const response = await res.json();

  return response.data;
}

async function loginWithGithub(code: string): Promise<any> {
  try {
    const res = await fetch(`${config.OAUTH_ENDPOINT}/github`, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      mode: 'cors',
      headers: {
        'git-hub-code': code,
      },
    });

    const response = await res.json();
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return {
      isError: !response.isSuccess,
      errorMessage: !response.isSuccess ? response.errors : null,
      user: response.isSuccess ? response.data : null,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
    };
  }
}

async function logOut(): Promise<any> {
  const userToken = JSON.parse(localStorage.getItem('user')).token;

  try {
    const res = await fetch(`${config.OAUTH_ENDPOINT}/github/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const response = await res.json();
    if (response.data) {
      localStorage.removeItem('user');
    }

    return {
      isError: !response.isSuccess,
      errorMessage: !response.isSuccess ? response.errors : null,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
    };
  }
}
