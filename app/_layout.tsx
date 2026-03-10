import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";

import { AuthContext, AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const { token, initializing } = useContext(AuthContext);

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [token, initializing, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="screens/HistoryScreen"
        options={{ headerShown: true, title: "History" }}
      />
      <Stack.Screen
        name="screens/MedicineDetailsScreen"
        options={{ headerShown: true, title: "Medicine Details" }}
      />
      <Stack.Screen
        name="screens/ScanBarcodeScreen"
        options={{ headerShown: true, title: "Scan Barcode" }}
      />
      <Stack.Screen
        name="screens/SearchMedicineScreen"
        options={{ headerShown: true, title: "Search Medicine" }}
      />
      <Stack.Screen
        name="screens/MedicineRemindersScreen"
        options={{ headerShown: true, title: "Reminders" }}
      />
      <Stack.Screen
        name="screens/ProfileScreen"
        options={{ headerShown: true, title: "Profile" }}
      />
      <Stack.Screen
        name="screens/AccessibilityScreen"
        options={{ headerShown: true, title: "Accessibility" }}
      />
      <Stack.Screen
        name="screens/SupportLanguageScreen"
        options={{ headerShown: true, title: "Support language" }}
      />
    </Stack>
  );
}
