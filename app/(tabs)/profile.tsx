import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebase";

 export default function ProfileScreen() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("https://i.imgur.com/BoN9kdC.png");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("❌ Користувач не авторизований");
        router.replace("/login");
        return;
      }

      setUid(user.uid);
      console.log("✅ Авторизований користувач:", user.uid);

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || "");
          setPhotoURL(data.photoURL || "https://i.imgur.com/BoN9kdC.png");
        } else {
          console.log("📄 Документ не існує. Можливо, новий користувач.");
        }
      } catch (err) {
        console.log("❌ Помилка завантаження профілю:", err);
        setError("Не вдалося завантажити профіль. Перевірте інтернет або права доступу.");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!uid) {
      Alert.alert("Помилка", "Користувач не авторизований.");
      return;
    }

    try {
      await setDoc(doc(db, "users", uid), {
        displayName,
        photoURL,
      });

      Alert.alert("✅ Успіх", "Профіль збережено.");
      setIsEditing(false);
    } catch (err) {
      console.log("❌ Помилка збереження профілю:", err);
      Alert.alert("Помилка", "Не вдалося зберегти профіль.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "#1c1c2a" }}>
      {error && (
        <Text style={{ color: "#ff6b6b", marginBottom: 20, fontSize: 14 }}>{error}</Text>
      )}

      <View style={styles.headerRow}>
        <Text style={styles.title}>{displayName || "Користувач"}</Text>
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Ionicons name="create-outline" size={22} color="#7B61FF" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: photoURL }} style={styles.avatar} />

      {isEditing && (
        <View style={styles.editBox}>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.editPhoto}>📸 Змінити фото</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Нове ім’я"
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Зберегти</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мої списки</Text>
        <TouchableOpacity style={styles.listItem} onPress={() => router.push("/watched")}>
          <Ionicons name="eye-outline" size={20} color="#7B61FF" />
          <Text style={styles.listText}>Переглянуті фільми</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => router.push("/favorites")}>
          <Ionicons name="heart-outline" size={20} color="#7B61FF" />
          <Text style={styles.listText}>Улюблене</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => router.push("/watch-later")}>
          <Ionicons name="time-outline" size={20} color="#7B61FF" />
          <Text style={styles.listText}>Переглянути пізніше</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мої відгуки</Text>
        <TouchableOpacity style={styles.listItem} onPress={() => router.push("/reviews")}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#7B61FF" />
          <Text style={styles.listText}>Всі відгуки</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
  avatar: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginBottom: 20,
  },
  editBox: {
    width: "100%",
    backgroundColor: "#2e2e3e",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  editPhoto: {
    color: "#7B61FF",
    fontSize: 14,
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1c1c2a",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#7B61FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    width: "100%",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  listText: {
    color: "#ccc",
    marginLeft: 15,
    fontSize: 20,
  },
});
