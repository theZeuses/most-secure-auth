import Head from 'next/head'
import { ReactElement, useEffect } from 'react'
import UserLayout from '../layouts/UserLayout'
import { NextPageWithLayout } from './_app'
import { useRouter } from 'next/router';
import Post from '../components/Post';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Tips</title>
      </Head>
      <Post />
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserLayout>
      {page}
    </UserLayout>
  )
}

export default Page
