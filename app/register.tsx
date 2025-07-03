import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../config/firebase";

 export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Помилка", "Заповни всі поля");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Створюємо профіль у Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        displayName: "Користувач",
        photoURL: "https://i.imgur.com/BoN9kdC.png",
      });

      Alert.alert("Успіх", "Акаунт створено!");
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Помилка реєстрації", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Підтвердити пароль"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Зареєструватись</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.registerLink}>
          Вже є акаунт?{" "}
          <Text style={styles.registerLinkHighlight}>Увійти</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c2a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 40,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#e5ebff",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7B61FF",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 20,
  },
  registerLinkHighlight: {
    color: "#7B61FF",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
