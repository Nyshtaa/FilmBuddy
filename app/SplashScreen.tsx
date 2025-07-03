import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/home");
      });
    }, 2000);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.logo}>🎬 FilmBuddy</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B61FF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SplashScreen;
