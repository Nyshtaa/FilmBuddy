import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase";
import MovieCard from "../../src/components/MovieCard";
import { fetchMovies } from "../../src/services/movieService";
import { getGuestTopMovies, getSmartRecommendedMovies } from "../../src/services/recommendationService";


 export default function HomeScreen() {
  const router = useRouter();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [randomMovie, setRandomMovie] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    setIsGuest(!user);
    setLoading(true);

    const [top, up, now] = await Promise.all([
      fetchMovies("top_rated"),
      fetchMovies("upcoming"),
      fetchMovies("now_playing"),
    ]);

    setTopRated(top);
    setUpcoming(up);
    setNowPlaying(now);

    let rec = [];
    if (user) {
      rec = await getSmartRecommendedMovies(user.uid);
      console.log("🔐 Авторизований — рекомендацій:", rec.length);
    } else {
      rec = await getGuestTopMovies();
      console.log("👥 Гість — топ:", rec.length);
    }

    setRecommended(rec);
    setLoading(false);
  });

  return () => unsubscribe(); // clean up
}, []);


  const getRandomMovie = () => {
    const all = [...recommended, ...topRated, ...upcoming, ...nowPlaying];
    if (all.length === 0) return;
    const selected = all[Math.floor(Math.random() * all.length)];
    setRandomMovie(selected);
    setShowModal(true);
  };

  const renderSection = (title: string, data: any[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/movie/[id]", params: { id: item.id.toString() } })
            }
            style={styles.cardWrapper}
          >
            <MovieCard title={item.title} posterPath={item.poster_path} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  const recommendedTitle = isGuest ? "Топ-20" : "Рекомендовані";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={getRandomMovie} activeOpacity={0.85} style={styles.buttonWrapper}>
          <LinearGradient
            colors={["#A288FF", "#7B61FF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Випадковий фільм</Text>
          </LinearGradient>
        </TouchableOpacity>

        {renderSection(recommendedTitle, recommended)}
        {renderSection("Топ рейтингу", topRated)}
        {renderSection("Очікувані", upcoming)}
        {renderSection("Нові релізи", nowPlaying)}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {randomMovie && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    router.push({
                      pathname: "/movie/[id]",
                      params: { id: randomMovie.id.toString() },
                    });
                  }}
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}` }}
                    style={styles.poster}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={getRandomMovie} style={styles.tryAgain}>
                  <Text style={styles.tryAgainText}>Спробувати ще раз</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={styles.closeText}>Закрити</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardWrapper: {
    marginRight: 12,
  },
  randomIconButton: {
    backgroundColor: "#7B61FF",
    padding: 12,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1c1c2a",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  poster: {
    width: 250,
    height: 375,
    borderRadius: 8,
    marginBottom: 20,
  },
  tryAgain: {
    backgroundColor: "#7B61FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  tryAgainText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginTop: 20,
    alignSelf: 'center',
  },
  
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 26,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 6,
  },
  
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
  },
  
  
  closeText: {
    color: "#bbb",
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
