import './App.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    from,
} from "@apollo/client";

import {Route, Switch} from 'react-router-dom';


import {onError} from "@apollo/client/link/error";
import GetMovies from "./Components/GetMovies";
import styled from 'styled-components';
import MovieForm from "./Components/MovieForm";
import React from "react";


const errorLink = onError(({graphqlErrors, networkError}) => {
    if (graphqlErrors) {
        graphqlErrors.map(({message, location, path}) => {
            alert(`Graphql error ${message}`);
        });
    }
});

const link = from([
    errorLink,
    new HttpLink({uri: "http://localhost:3005/graphql"}),
]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
});

function App() {
    return (
        <>
            <ApolloProvider client={client}>
                <Switch>
                    <div className="app">
                        <GetMovieContainer>
                            <Route exact path='/' component={GetMovies} />
                            <Route exact path='/createMovie' component={MovieForm}/>
                            <Route exact path={'/editMovieForm/:id'} component={MovieForm}/>
                        </GetMovieContainer>
                    </div>
                </Switch>
            </ApolloProvider>
        </>
    );
}

export default App;


const GetMovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10px;
`;

