import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/firebase";

 export default function MyReviews ()  {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "reviews"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/movie/[id]",
          params: { id: item.movieId },
        })
    }
    >
      <View style={styles.card}>
        <View style={styles.row}>
          {item.poster && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster}` }}
              style={styles.poster}
            />
          )}
          <Text style={styles.movieTitle}>{item.movieTitle || "Фільм без назви"}</Text>
        </View>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.actions}>
          <Text style={styles.likes}>👍 {item.likes || 0}</Text>
          <Text style={styles.dislikes}>👎 {item.dislikes || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#7B61FF" />
        </TouchableOpacity>
      <Text style={styles.title}>Мої відгуки</Text>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
    paddingHorizontal: 16,
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },  
  card: {
    backgroundColor: "#1f1f2e",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 10,
  },
  movieTitle: {
    color: "#7B61FF",
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 20,
  },
  likes: {
    color: "#7BFF8F",
  },
  dislikes: {
    color: "#FF6F6F",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
