import React from "react";
import { FlatList } from "react-native";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Props {
  movies: Movie[];
}

const MovieList: React.FC<Props> = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      renderItem={({ item }) =>
        item ? (
          <MovieCard title={item.title} posterPath={item.poster_path} />
        ) : null
      }
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default MovieList;
