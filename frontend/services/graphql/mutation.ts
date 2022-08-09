import { gql } from "@apollo/client";

export const INSERT_LIKE = gql`
    mutation ($post_id: Float!, $ip: String!) {
        createLike(input: { post_id: $post_id, ip: $ip}) {
            id
        }
    }
`