import merge from "deepmerge"
import { useMemo } from "react"
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Operation, NormalizedCacheObject } from "@apollo/client"
import { getJwtToken } from "./authHelper"
import { makeTokenRefreshLink } from "./apolloTokenRefreshLink"
import app_config from "../config/app_config"

let apolloClient: ApolloClient<NormalizedCacheObject>; 

function getHeaders() {
    const headers = {} as HeadersInit & { [index: string]: any};
    const token = getJwtToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
}

function createLink() {
    const httpLink = new HttpLink({
        uri: app_config.GRAPHQL_URL,
        // credentials: "include" is REQUIRED for cookies to work
        credentials: "include",
    })

    const authLink = new ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                ...getHeaders(),
            },
        }))
        return forward(operation)
    })

    const tokenRefreshLink = makeTokenRefreshLink()

    // Only use token refresh link on the client
    if (typeof window !== "undefined") {
        return ApolloLink.from([
            tokenRefreshLink,
            authLink,
            httpLink,
        ])
    } else {
        return ApolloLink.from([authLink, httpLink])
    }
}

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: createLink(),
        cache: new InMemoryCache(),
    })
}

export function initializeApollo(initialState = null): ApolloClient<NormalizedCacheObject> {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache)

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function useApollo(initialState = null) {
    const store = useMemo(() => initializeApollo(initialState), [initialState])
    return store
}