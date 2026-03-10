import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/theme";

const LANGS = [
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
  { id: "mr", label: "Marathi" },
];

export default function SupportLanguageScreen() {
  // Simple placeholder – can be wired to real i18n later.

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Language</Text>
        <Text style={styles.subtitle}>Support (local language)</Text>

        {LANGS.map((opt) => (
          <Pressable
            key={opt.id}
            style={styles.option}
            accessibilityRole="button"
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  option: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "800",
  },
});

