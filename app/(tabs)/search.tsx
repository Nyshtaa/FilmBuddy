import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MovieCard from "../../src/components/MovieCard";
import {
  fetchGenres,
  fetchMoviesByGenre,
  searchMovies,
} from "../../src/services/movieService";


// Тип для фільму
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
};

// Тип для жанру
type Genre = {
  id: number;
  name: string;
};

function SearchScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<{ [key: number]: Movie[] }>({});
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres);

      const movies: { [key: number]: Movie[] } = {};
      for (const genre of fetchedGenres) {
        const res = await fetchMoviesByGenre(genre.id);
        movies[genre.id] = res.results;
      }
      setMoviesByGenre(movies);
    };

    fetchGenresAndMovies();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (text.trim() === "") {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      const results = await searchMovies(text);
      setSearchResults(results);
      setSearching(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [text]);

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Пошук фільмів..."
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
      />

      {searching ? (
        <Text style={styles.sectionTitle}>Шукаємо...</Text>
      ) : searchResults.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Результати пошуку</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/movie/[id]",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <View style={styles.movieItem}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
                    style={styles.poster}
                  />
                  <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{item.title}</Text>
                    <Text style={styles.movieYear}>
                      {item.release_date ? item.release_date.slice(0, 4) : "—"}
                    </Text>
                    <Text style={styles.details}>
                      Оцінка: ⭐ {item.vote_average?.toFixed(1)} / 10
                    </Text>
                    <Text style={styles.readMore}>Дивитись більше...</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        genres.map((genre) => (
          <View key={genre.id}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>{genre.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/genre",
                    params: {
                      genreId: genre.id.toString(),
                      genreName: genre.name,
                    },
                  })
                }
              >
                <Text style={styles.viewAll}>Дивитись все</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={moviesByGenre[genre.id]}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/movie/[id]",
                      params: { id: item.id.toString() },
                    })
                  }
                >
                  <MovieCard title={item.title} posterPath={item.poster_path} />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}
export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#121212",
    flex: 1,
  },
  input: {
    height: 50,
    backgroundColor: "#2e2e3e",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginTop: 40,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  viewAll: {
    color: "#7B61FF",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  movieItem: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 15,
  },
  poster: {
    width: 165,
    height: 230,
    borderRadius: 10,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "flex-start",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  movieYear: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 5,
  },
  details: {
    color: "#ccc",
    fontSize: 24,
  },
  readMore: {
    color: "#7B61FF",
    fontSize: 17,
    marginTop: 3,
  },
});
