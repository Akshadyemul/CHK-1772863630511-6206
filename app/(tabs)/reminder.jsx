import React, { useEffect, useMemo, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

import { Colors } from "../constants/theme";
import { LargeButton } from "../components/LargeButton";
import { createReminder, getReminders } from "../services/api";
import { useLocalSearchParams } from "expo-router";

function formatTime(date) {
  try {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getMedicineTitle(medicine) {
  if (!medicine) return "";

  return (
    medicine.name ||
    medicine.medicineName ||
    medicine.brandName ||
    medicine.genericName ||
    medicine.title ||
    ""
  );
}

export default function ReminderScreen() {
  const params = useLocalSearchParams();
  const incomingMedicineString = params?.medicine;
  let incomingMedicine = null;
  try {
    incomingMedicine = typeof incomingMedicineString === 'string' ? JSON.parse(incomingMedicineString) : null;
  } catch(_e) {}

  const initialName = useMemo(
    () => getMedicineTitle(incomingMedicine),
    [incomingMedicine],
  );

  const [medicineName, setMedicineName] = useState(initialName);

  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);
    return d;
  });

  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [remindersError, setRemindersError] = useState("");

  const canSave = useMemo(() => {
    return medicineName.trim().length > 0 && !saving;
  }, [medicineName, saving]);

  async function loadReminders() {
    try {
      setRemindersError("");
      setLoadingReminders(true);

      const data = await getReminders();

      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      setRemindersError(e?.message || "Could not load reminders.");
    } finally {
      setLoadingReminders(false);
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  async function onSave() {
    if (!canSave) return;

    Keyboard.dismiss();
    setSaving(true);
    setMessage("");

    try {
      const iso = time.toISOString();

      const dateString = iso.slice(0, 10);
      const timeString = formatTime(time);

      await createReminder({
        medicineName,
        time: timeString,
        date: dateString,
      });

      setMessage("Reminder saved successfully.");

      Alert.alert("Saved", "Your reminder has been saved.");

      await loadReminders();
    } catch (e) {
      setMessage(e?.message || "Could not save reminder. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Set a Reminder</Text>

        <Text style={styles.subtitle}>
          Enter the medicine name and choose a time. We will remind you to take
          it.
        </Text>

        <Text style={styles.label}>Medicine name</Text>

        <TextInput
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="Example: Paracetamol"
          placeholderTextColor="#6B7C8C"
          style={styles.input}
          editable={!saving}
        />

        <Text style={styles.label}>Reminder time</Text>

        {Platform.OS === "android" ? (
          <View style={styles.timeRow}>
            <View style={styles.timeValueBox}>
              <Text style={styles.timeValue}>{formatTime(time)}</Text>
            </View>

            <View style={styles.timeButtonWrap}>
              <LargeButton
                title="Choose Time"
                onPress={() => setShowPicker(true)}
                accessibilityLabel={undefined}
              />
            </View>
          </View>
        ) : (
          <View style={styles.iosPickerWrap}>
            <Text style={styles.timeValueLarge}>{formatTime(time)}</Text>
          </View>
        )}

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              if (Platform.OS === "android") {
                setShowPicker(false);
              }

              if (selected) {
                setTime(selected);
              }
            }}
          />
        )}

        {message ? (
          <Text
            style={
              message.includes("successfully") ? styles.success : styles.error
            }
          >
            {message}
          </Text>
        ) : null}

        <LargeButton
          title={saving ? "Saving…" : "Save Reminder"}
          onPress={onSave}
          accessibilityLabel={undefined}
        />

        <Text style={[styles.title, { marginTop: 25 }]}>Your Reminders</Text>

        {loadingReminders && <ActivityIndicator size="large" color="#1E88E5" />}

        {remindersError ? (
          <Text style={styles.error}>{remindersError}</Text>
        ) : null}

        {reminders.length === 0 && !loadingReminders && !remindersError && (
          <Text style={styles.noReminders}>No reminders yet.</Text>
        )}

        {reminders.map((r, index) => (
          <View key={r?._id || index} style={styles.reminderItem}>
            <Text style={styles.reminderName}>{r?.medicineName}</Text>

            <Text style={styles.reminderTime}>
              {r?.date} at {r?.time}
            </Text>
          </View>
        ))}
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
    flexGrow: 1,
    padding: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textMuted,
    lineHeight: 28,
    marginBottom: 14,
  },
  label: {
    fontSize: 18,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    color: Colors.text,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeValueBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: "center",
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  timeButtonWrap: {
    width: 170,
  },
  iosPickerWrap: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  timeValueLarge: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  success: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.success,
  },
  error: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.error,
  },
  noReminders: {
    fontSize: 18,
    color: Colors.textMuted,
    marginTop: 10,
  },
  reminderItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  reminderName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  reminderTime: {
    fontSize: 18,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '600'
  },
});
