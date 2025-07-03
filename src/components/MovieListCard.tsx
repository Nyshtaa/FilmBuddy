import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: string;
};

const MovieListCard = ({ id, title, poster, rating, year }: Props) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w300${poster}` }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.rating}>
          Оцінка: <Ionicons name="star" size={16} color="#FFD700" /> {rating.toFixed(1)} / 10
        </Text>
        <TouchableOpacity onPress={() => router.push(`/movie/${id}`)}>
          <Text style={styles.link}>Дивитись більше..</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieListCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    overflow: "hidden",
  },
  poster: {
    width: 120,
    height: 180,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  year: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  rating: {
    color: "#fff",
    marginBottom: 6,
  },
  link: {
    color: "#7B61FF",
    marginTop: 4,
  },
});
