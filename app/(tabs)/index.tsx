import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CircleButton } from "../components/CircleButton";
import { FeaturedCard } from "../components/FeaturedCard";
import { LargeButton } from "../components/LargeButton";
import HeaderMenu from "../components/HeaderMenu";
import { Colors } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user, signOut } = useContext(AuthContext);

  const openSearchMedicine = () => {
    router.push("/screens/SearchMedicineScreen");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>Hi {user?.name || "there"}</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Logout"
              onPress={async () => {
                await signOut();
                router.replace("/(auth)/login");
              }}
              style={({ pressed }) => [
                styles.logout,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={Colors.primary}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>

            <HeaderMenu
              trigger={
                <View style={styles.avatar}>
                  <Ionicons name="person" size={30} color={Colors.surface} />
                </View>
              }
            />
          </View>
        </View>

        <FeaturedCard
          title="Goutam Wanga"
          subtitle=""
          iconName="medkit-outline"
          dateInfo="Sunday, 12 June"
          timeInfo="11:00 – 12:00 AM"
          onPress={openSearchMedicine}
        />

        <Pressable
          style={styles.searchWrapper}
          onPress={openSearchMedicine}
          accessibilityRole="button"
          accessibilityLabel="Search medicine"
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={Colors.textMuted}
          />
          <Text style={styles.searchPlaceholder}>
            Search doctor, medicine or health issue
          </Text>
        </Pressable>

        <View style={styles.chipRow}>
          <CircleButton
            title="Barcode"
            iconName="barcode"
            onPress={() =>
              router.push({ pathname: "/(tabs)/scanqr" })
            }
          />
          <CircleButton
            title="Reminder"
            iconName="alarm-outline"
            onPress={() =>
              router.push({ pathname: "/(tabs)/reminder" })
            }
          />
          <CircleButton
            title="Medicine"
            iconName="flask-outline"
            onPress={() => router.push("/screens/SearchMedicineScreen")}
          />
          <CircleButton
            title="History"
            iconName="time-outline"
            onPress={() =>
              router.push({ pathname: "/(tabs)/history" })
            }
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>

        <LargeButton
          title="Search Medicine"
          onPress={() => router.push("/screens/SearchMedicineScreen")}
          accessibilityLabel="Search medicine"
          style={undefined}
        />
        <LargeButton
          title="Scan Barcode"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/scanqr",
            })
          }
          accessibilityLabel="Open barcode scanner"
          style={undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  hello: {
    fontSize: 18,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  logoutText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 26,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.textMuted,
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },
});