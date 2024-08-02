-- Create movies table

CREATE TABLE movies (
    id SERIAL PRIMARY KEY NOT NULL,
    movie_name VARCHAR(255) NOT NULL,
    movie_genre VARCHAR(50),
    movie_runtime INTEGER NOT NULL,
    release_date DATE NOT NULL,
    director VARCHAR(100) NOT NULL
);