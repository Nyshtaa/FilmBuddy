import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../config/firebase";
import ReviewsSection from "../../src/components/ReviewsSection";
import { fetchMovieCredits, fetchMovieDetails } from "../../src/services/movieService";
import { useLocalSearchParams, useRouter } from "expo-router";
 export default function MovieDetails  ()  {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState<any[]>([]);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isInWatched, setIsInWatched] = useState(false);
  const [isInWatchLater, setIsInWatchLater] = useState(false);

  const goBack = () => {
  if (router.canGoBack?.()) {
    router.back();
  } else {
    router.replace("/"); 
  }
};

  useEffect(() => {
    const loadMovie = async () => {
      const data = await fetchMovieDetails(Number(id));
      const credits = await fetchMovieCredits(Number(id));
      setMovie(data);
      setCast(credits.cast.slice(0, 8));
      setLoading(false);
    };

    loadMovie();
  }, [id]);

  const handleAddToList = async (listName: "favorites" | "watched" | "watchLater") => {
  console.log("🔘 Натиснуто кнопку списку:", listName);

  const user = getAuth().currentUser;
  console.log("👤 Поточний користувач:", user);

  if (!user) {
    console.log("⚠️ Користувач не авторизований — показуємо Alert");

    Alert.alert(
      "Потрібна авторизація",
      "Щоб зберігати фільми у списках, спочатку увійдіть у свій акаунт.",
      [
        { text: "Скасувати", style: "cancel" },
        { text: "Увійти", onPress: () => router.push("/login") },
      ]
    );

    // Якщо на Web — Alert не працює. Використай заміну:
    if (Platform.OS === "web") {
      window.alert("Щоб зберігати фільми, увійдіть у свій акаунт");
    }

    return;
  }

  if (!id || !movie) {
    console.log("❌ Відсутній ID або дані про фільм");
    return;
  }

  const ref = doc(db, "users", user.uid, listName, id.toString());
  const snap = await getDoc(ref);

  const toggle = {
    favorites: () => setIsInFavorites(!snap.exists()),
    watched: () => setIsInWatched(!snap.exists()),
    watchLater: () => setIsInWatchLater(!snap.exists()),
  };

  if (snap.exists()) {
    console.log("🗑 Фільм уже в списку — видаляємо");
    await deleteDoc(ref);
    toggle[listName]();
    Alert.alert("Видалено", "Фільм прибрано зі списку.");
  } else {
    console.log("✅ Додаємо фільм до списку:", listName);
    await setDoc(ref, {
      title: movie.title,
      poster: movie.poster_path,
      addedAt: new Date(),
    });
    toggle[listName]();
    Alert.alert("Додано", `Фільм додано до списку ${listName}.`);
  }
};


  if (loading || !movie) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#7B61FF" />
        </TouchableOpacity>
        <Text style={styles.title}>{movie.title}</Text>
      </View>

      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />

      <Text style={styles.year}>
        {movie.release_date ? movie.release_date.slice(0, 4) : "—"}
      </Text>

      <Text style={styles.sectionTitle}>Актори</Text>
      <Text style={styles.castList}>
        {cast.map((actor: any) => actor.name).join(", ")}
      </Text>

      <Text style={styles.sectionTitle}>Рейтинг</Text>
      <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)} /10</Text>

      <Text style={styles.sectionTitle}>Опис</Text>
      <Text style={styles.overview}>{movie.overview}</Text>

      <Text style={styles.sectionTitle}>Додати в список:</Text>
      <View style={styles.verticalListButtons}>
        <TouchableOpacity style={styles.listItem} onPress={() => handleAddToList("favorites")}>
          <Ionicons name={isInFavorites ? "heart" : "heart-outline"} size={24} color="#7B61FF" />
          <Text style={styles.listText}>Улюблене</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => handleAddToList("watched")}>
          <Ionicons name={isInWatched ? "eye" : "eye-outline"} size={24} color="#7B61FF" />
          <Text style={styles.listText}>Переглянуте</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => handleAddToList("watchLater")}>
          <Ionicons name={isInWatchLater ? "time" : "time-outline"} size={24} color="#7B61FF" />
          <Text style={styles.listText}>Переглянути пізніше</Text>
        </TouchableOpacity>
      </View>

      <ReviewsSection movieId={id as string} movieTitle={movie.title} />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  poster: {
    width: "100%",
    height: 600,
    borderRadius: 10,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    flexShrink: 1,
  },
  year: {
    color: "#aaa",
    fontSize: 23,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "right",
  },
  rating: {
    color: "#7B61FF",
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 6,
  },
  castList: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  overview: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
  },
  verticalListButtons: {
    backgroundColor: "#1a1a2a",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
    gap: 18,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  listText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
