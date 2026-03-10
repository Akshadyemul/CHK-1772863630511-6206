import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/theme";

const OPTIONS = [
  { id: "small", label: "Small text" },
  { id: "medium", label: "Medium text" },
  { id: "large", label: "Large text" },
];

export default function AccessibilityScreen() {
  // NOTE: This is a simple, local-only version. It can be
  // enhanced later with a real SettingsContext if needed.

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Accessibility</Text>
        <Text style={styles.subtitle}>Choose a comfortable text size</Text>

        {OPTIONS.map((opt) => (
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

