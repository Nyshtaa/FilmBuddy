import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase";

 export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Помилка входу", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід у FilmBuddy</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry placeholderTextColor="#aaa" value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Увійти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
  <Text style={styles.registerLink}>
    Немає акаунта? <Text style={styles.registerLinkHighlight}>Зареєструйся</Text>
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
    backgroundColor: "#2e2e3e",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
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
