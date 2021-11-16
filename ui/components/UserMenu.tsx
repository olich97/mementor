import { Transition } from '@tailwindui/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { oAuthService } from '../lib/oAuthService';

/**
 * Based off of gatsby-theme-novela
 * https://github.com/narative/gatsby-theme-novela/blob/master/%40narative/gatsby-theme-novela/src/components/Navigation/Navigation.Header.tsx
 */

const UserMenu = (): JSX.Element => {
  const [userProfile, setUserProfile] = useState(null);
  const [show, setShow] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (oAuthService.loggedUser) {
      setUserProfile(oAuthService.loggedUser);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!container?.current?.contains(event.target)) {
        if (!show) return;
        setShow(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [show, container]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!show) return;

      if (event.key === 'Escape') {
        setShow(false);
      }
    };

    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [show]);

  return (
    <div>
      {userProfile && (
        <div ref={container} className="relative">
          <button className="menu focus:outline-none focus:shadow-solid " onClick={() => setShow(!show)}>
            <img className="w-12 h-12 rounded-full" src={userProfile.photoProfileUrl} alt={userProfile.username} />
          </button>

          <Transition
            show={show}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="origin-top-right absolute right-0 w-48 bg-white rounded shadow-md">
              <Link href="/oauth/github/logout">
                <a className="block text-black border transition-colors duration-150 dark:text-white px-4 py-2 hover:bg-black dark:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black">
                  Logout
                </a>
              </Link>
            </div>
          </Transition>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
