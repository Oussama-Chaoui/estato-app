'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Routes from '@/common/defs/routes';
import useAuth from '../hooks/api/useAuth';

export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
}

interface WithAuthOptions {
  mode?: AUTH_MODE;
  redirectUrl?: string;
}

type Props = Record<string, unknown>;

const withAuth = (
  Component: React.ComponentType<Props>,
  options: WithAuthOptions = {}
) => {
  const WrappedComponent = (props: Props) => {
    const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const mode = options.mode ?? AUTH_MODE.LOGGED_IN;

    // build the full current URL (including query)
    const rawQuery = searchParams.toString();
    const currentUrl = pathname + (rawQuery ? `?${rawQuery}` : '');

    if (authEnabled) {
      if (mode === AUTH_MODE.LOGGED_IN && !user) {
        // if we're on home, just send to login
        if (pathname === Routes.Common.Home) {
          router.push(options.redirectUrl ?? Routes.Auth.Login);
          return null;
        }
        // otherwise carry ?url= current page
        const target = options.redirectUrl ?? Routes.Auth.Login;
        router.push(
          `${target}?url=${encodeURIComponent(currentUrl)}`
        );
        return null;
      }

      if (mode === AUTH_MODE.LOGGED_OUT && user) {
        const returnUrl = searchParams.get('url');
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
          return null;
        }
        router.push(options.redirectUrl ?? Routes.Common.Home);
        return null;
      }
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default withAuth;
