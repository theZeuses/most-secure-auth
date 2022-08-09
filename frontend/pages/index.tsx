import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>SAuth</title>
      </Head>
      <LoginForm />
    </>
  )
}

export default Page
