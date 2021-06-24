import '../styles/globals.css'
import { AppProps } from 'next/app';
import { useApollo } from '../lib/client';
import  { ApolloProvider } from '@apollo/client'

function MyApp({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState)
    return (
        <ApolloProvider client={ apolloClient }>
            <Component { ...pageProps } />
        </ApolloProvider>
    )
}

export default MyApp
