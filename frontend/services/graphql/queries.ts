import { gql } from "@apollo/client";

export const LOGIN = gql`
    query ($username: String!, $password: String!){
        Login(credentials: {username: $username, password: $password}){
            bearer_token
            refresh_token
            expires_in
        }
    }
`;

export const GET_POSTS = gql`
    query { 
        posts {
            id
            text
            summary {
                likes_count
            }
        }
    }
`;