import React, { useContext, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

import { Colors } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";

function HeaderMenu({ trigger }) {
  const router = useRouter();
  const { user, signOut } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  function close() {
    setVisible(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        style={trigger ? styles.triggerWrap : styles.trigger}
      >
        {trigger || (
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={Colors.text}
          />
        )}
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close} />

        <View style={styles.menuCardWrap}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>{user?.name || "Menu"}</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                close();
                router.push("/screens/ProfileScreen");
              }}
              accessibilityRole="button"
            >
              <Text style={styles.menuText}>Profile details</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                close();
                router.push("/screens/AccessibilityScreen");
              }}
              accessibilityRole="button"
            >
              <Text style={styles.menuText}>Accessibility</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                close();
                router.push("/screens/SupportLanguageScreen");
              }}
              accessibilityRole="button"
            >
              <Text style={styles.menuText}>Support (local language)</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, styles.menuItemLogout]}
              onPress={async () => {
                close();
                await signOut();
                router.replace("/(auth)/login");
              }}
              accessibilityRole="button"
            >
              <Text style={[styles.menuText, styles.menuTextLogout]}>
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export { HeaderMenu };
export default HeaderMenu;

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  triggerWrap: {
    padding: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  menuCardWrap: {
    position: "absolute",
    top: 70,
    right: 12,
    left: 60,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  menuTitle: {
    color: Colors.text,
    fontWeight: "800",
    marginBottom: 8,
    fontSize: 18,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  menuText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  menuItemLogout: {
    marginTop: 4,
    backgroundColor: Colors.background,
  },
  menuTextLogout: {
    color: Colors.primary,
  },
});

