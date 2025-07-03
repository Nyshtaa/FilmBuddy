import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface MovieCardProps {
  title: string;
  posterPath: string;
}

const MovieCard = ({ title, posterPath }: MovieCardProps) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 210,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
});

export default MovieCard;
