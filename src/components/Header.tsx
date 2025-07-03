import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: "#222",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
