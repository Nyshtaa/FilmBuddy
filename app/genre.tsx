import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchMoviesByGenre } from "../src/services/movieService";
import { Ionicons } from "@expo/vector-icons";


const GenreScreen = () => {
  
  const router = useRouter();
  const { genreId, genreName } = useLocalSearchParams<{
    genreId: string;
    genreName: string;
  }>();

  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (genreId) {
      loadMovies(1);
    }
  }, [genreId]);

  const loadMovies = async (pageNum: number = 1) => {
    try {
      const data = await fetchMoviesByGenre(Number(genreId), pageNum);
  
      const filtered = data.results.filter((movie: any) =>
        movie.overview && movie.overview.trim() !== ""
      );
  
      if (pageNum === 1) {
        setMovies(filtered); 
      } else {
        setMovies((prev) => [...prev, ...filtered]);
      }
  
      setHasMore(data.page < data.total_pages);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Помилка завантаження фільмів:", error);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadMovies(nextPage);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
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
            Оцінка: ⭐ {item.vote_average.toFixed(1)} / 10
          </Text>

           <TouchableOpacity
             onPress={() =>
               router.push({
                 pathname: "/movie/[id]",
                 params: { id: item.id.toString() },
               })
             }
           >
          <Text style={styles.readMore}>Дивитись більше..</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && movies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#7B61FF" />
        </TouchableOpacity>
        <Text style={styles.title}>{genreName}</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color="#7B61FF" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    gap: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 90,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});

export default GenreScreen;
