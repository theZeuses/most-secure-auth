import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import MainLayout from '../layouts/MainLayout'
import 'tailwindcss/tailwind.css';
import { useApollo } from '../helpers/apolloHelper'
import { ApolloProvider } from '@apollo/client'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>)

  const apolloClient = useApollo(pageProps.initialApolloState)  

  return (
    <ApolloProvider client={apolloClient}>
      { getLayout(<Component {...pageProps} />) }
    </ApolloProvider>
  )
}