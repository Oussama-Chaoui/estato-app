"use client";


import Routes from '@/common/defs/routes';
import LoginForm from '@/modules/auth/components/pages/LoginForm';
import withAuth, { AUTH_MODE } from '@/modules/auth/hocs/withAuth';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default withAuth(LoginPage, { mode: AUTH_MODE.LOGGED_OUT, redirectUrl: Routes.Common.Home });
