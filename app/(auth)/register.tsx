import { Link, useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LargeButton } from "../components/LargeButton";
import { Colors } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 6 &&
      !submitting
    );
  }, [name, email, password, submitting]);

  async function onRegister() {
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message || "Could not register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.safe}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Register once to keep your reminders and history safe.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
            textContentType="name"
            style={styles.input}
            editable={!submitting}
            returnKeyType="next"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={styles.input}
            editable={!submitting}
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 6 characters"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            textContentType="newPassword"
            style={styles.input}
            editable={!submitting}
            returnKeyType="done"
            onSubmitEditing={onRegister}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <LargeButton
            title={submitting ? "Creating…" : "Register"}
            onPress={onRegister}
            disabled={!canSubmit}
            accessibilityLabel="Register"
            style={styles.primaryButton}
          />

          {submitting ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : null}

          <Pressable accessibilityRole="button" style={styles.linkWrap}>
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Link href="/(auth)/login" style={styles.linkStrong}>
                Login
              </Link>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20, paddingTop: 34 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.textMuted,
    marginBottom: 18,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: Colors.text,
  },
  primaryButton: { marginTop: 16 },
  error: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.error,
    lineHeight: 22,
    fontWeight: "600",
  },
  linkWrap: { marginTop: 14 },
  linkText: { fontSize: 16, color: Colors.textMuted },
  linkStrong: { color: Colors.primary, fontWeight: "800" },
});

