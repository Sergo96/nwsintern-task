import React, {useEffect, useState} from "react";
import {CREATE_MOVIE_MUTATION, EDIT_MOVIE_MUTATION} from "../GraphQL/Mutations";
import {gql, useMutation, useQuery} from "@apollo/client";
import TextField from '@material-ui/core/TextField';
import {Button} from "@material-ui/core";
import styled from 'styled-components';
import {Redirect, useHistory, useParams} from "react-router-dom";
import {LOAD_MOVIES} from "../GraphQL/Queries";


const MovieForm = () => {
    const [name, setName] = useState("");
    const [genre, setGenre] = useState("");
    const [addMovie, {error}] = useMutation(CREATE_MOVIE_MUTATION);
    const [updateMovie] = useMutation(EDIT_MOVIE_MUTATION);
    const {id} = useParams();

    // const stringId = id.toString();
    console.log(name);

    const LOAD_MOVIE = gql(`
       query{
            movie(id:"${id}"){
                name
                genre
             }
    }
`);


    const {loading, data} = useQuery(LOAD_MOVIE);
    const [movieData, setMovieData] = useState([]);

    console.log(movieData)

    useEffect(() => {
        if (data) {
            setMovieData(data.movie);
        }
        setName(movieData.name);
        setGenre(movieData.genre);
    }, [data, movieData]);


    const createMovie = () => {
        addMovie({
            variables: {
                name: name,
                // genre: genre,
            },

            refetchQueries: [{query: LOAD_MOVIES}]

        });

        if (error) {
            console.log(error);
        }
    };

    const editMovie = () => {
        updateMovie({
            variables: {
                name: name,
                genre: genre,
            },
        });

    };

    let history = useHistory();

    const redirect = () => {
        history.push('/')
    }
    return (
        <>
            <MovieFormContainer>
                <TextField
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <TextField
                    type="text"
                    placeholder="genre"
                    value={genre}
                    onChange={(e) => {
                        setGenre(e.target.value);
                    }}
                />
                {id ? (
                    <Button onClick={() => {
                        editMovie();
                        redirect();
                    }}>Edit Movie</Button>
                ) : (
                    <Button onClick={() => {
                        createMovie();
                        redirect();
                    }}>Create Movie</Button>
                )}
            </MovieFormContainer>

        </>

    );

};

export default MovieForm;

const MovieFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  margin: 0 auto;
  padding-top: 10px;
`;