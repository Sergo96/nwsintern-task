import {gql} from "@apollo/client";

export const LOAD_MOVIES = gql(`
    query{
         movies{
            id
            name
            genre           
         }
    }
`);