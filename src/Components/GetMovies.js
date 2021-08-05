import React, {useEffect, useState} from "react";
import {useQuery, useLazyQuery, gql, useMutation} from '@apollo/client';
import {LOAD_MOVIES} from '../GraphQL/Queries';
import {Link, Redirect} from 'react-router-dom';
import {Button} from "@material-ui/core";
import {DELETE_MOVIE_MUTATION} from "../GraphQL/Mutations";
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import styled from 'styled-components';


const rand = () => {
    return Math.round(Math.random() * 20) - 10;
}

const getModalStyle = () => {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const GetMovies = () => {
    // const {error, loading, data} = useQuery(LOAD_MOVIES);
    const [getMovies, {error, loading, data}] = useLazyQuery(LOAD_MOVIES);
    const [movies, setMovies] = useState([]);
    const [deleteMovie] = useMutation(DELETE_MOVIE_MUTATION);
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);




    console.log(data)


    useEffect(() => {

        if (data) {
            setMovies(data.movies);
        }
    }, [data]);

    const removeMovie = (id) => {
        deleteMovie({
            variables: {
                id: id
            },
            refetchQueries: [{query: LOAD_MOVIES}]
        });

        if (error) {
            console.log(error);
        }
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    if (loading) return <p>Loading ...</p>;


    return (
        <>
            <button onClick={() => getMovies()}>
                Click me to print all movies!
            </button>
            {movies.map((val) => {
                return (
                    <MovieOption>
                        <Link to={`editMovieForm/${val.id}`} style={{textDecoration: 'none'}}>
                            <MovieName key={val.id}>{val.name} - <span>{val.genre}</span> </MovieName>
                        </Link>
                        <Button color={"secondary"} type="button" onClick={handleOpen}>
                            Delete
                        </Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div style={modalStyle} className={classes.paper}>
                                <h2 id="simple-modal-title">Warning</h2>
                                <p id="simple-modal-description">
                                    Are you sure about that?.
                                </p>

                                <Button
                                    id={val.id}
                                    key={val.id}
                                    color={"secondary"}
                                    // onClose={handleClose}

                                    onClick={() => {
                                        removeMovie(val.id);
                                        // redirect();
                                        handleClose();
                                    }}>
                                    Delete
                                </Button>
                            </div>
                        </Modal>
                    </MovieOption>

                )
            })}
            <Link to={`/createMovie`}>
                <p>Create movie</p>
            </Link>

        </>
    )
};


export default GetMovies;

const MovieName = styled.h3`
  color: rgba(105, 105, 105, 0.95);
  cursor: pointer;
  margin-bottom: 5px;
  margin-right: 10px;


  &:hover {
    color: rgba(30, 30, 30, 0.95);
  }
`;

const MovieOption = styled.div`
  display: flex;
  margin: 0 auto;
`;

