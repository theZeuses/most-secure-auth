import { TokenRefreshLink } from "apollo-link-token-refresh";
import { JwtPayload } from "jwt-decode";
import { getJwtToken, getRefreshToken, setExpiresIn, setJwtToken, setRefreshToken } from "./authHelper";
import decodeJWT from "jwt-decode";
import app_config from '../config/app_config';

export function makeTokenRefreshLink() {
    return new TokenRefreshLink({
        accessTokenField: 'RefreshToken',
        // Indicates the current state of access token expiration
        // If token not yet expired or user doesn't have a token (guest) true should be returned
        isTokenValidOrUndefined: () => {
            const token = getJwtToken()

            // If there is no token, the user is not logged in
            // We return true here, because there is no need to refresh the token
            if (!token) return true

            // Otherwise, we check if the token is expired
            const claims: JwtPayload = decodeJWT(token)
            if(!claims.exp) return true;
            const expirationTimeInSeconds = claims.exp * 1000;
            const now = new Date();
            const isValid = expirationTimeInSeconds >= now.getTime();

            // Return true if the token is still valid, otherwise false and trigger a token refresh
            return isValid
        },
        fetchAccessToken: async () => {
            const token = getJwtToken();
            if(!token) throw 'NO TOKEN';

            const refreshToken = getRefreshToken();

            const request = await fetch(app_config.GRAPHQL_URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`
                },
                body: JSON.stringify({
                    query: 
                        `query {
                            RefreshToken {
                                bearer_token
                                refresh_token
                                expires_in
                            }
                        }`
                }),
            })

            return request
        },
        handleFetch: (authTokens: { 
            bearer_token: string, 
            refresh_token: string, 
            expires_in: string
        }) => {
            setJwtToken(authTokens.bearer_token);
            setRefreshToken(authTokens.refresh_token);
            setExpiresIn(authTokens.expires_in);
        },
        handleError: (err) => {
            // Remove invalid tokens
            localStorage.removeItem("jwt");
            localStorage.removeItem("refreshToken");
        },
    })
}