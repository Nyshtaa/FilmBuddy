import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/firebase";
import MovieListCard from "../src/components/MovieListCard";

 export default function Watched() {
    const [movies, setMovies] = useState<any[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      const fetchWatched = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const snapshot = await getDocs(collection(db, "users", user.uid, "watched"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMovies(list);
      };
      fetchWatched();
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#7B61FF" />
        </TouchableOpacity>
      <Text style={styles.title}>Переглянуті фільми</Text>
      </View>
        <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <MovieListCard
            id={item.id}
            title={item.title}
            poster={item.poster}
            rating={item.rating || 6.5}
            year={item.year || "2023"}
            />
        )}
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
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      gap: 16,
    },
    poster: {
      width: 60,
      height: 90,
      borderRadius: 6,
    },
    text: {
      color: "#fff",
      fontSize: 16,
      flexShrink: 1,
    },
  });
  
  