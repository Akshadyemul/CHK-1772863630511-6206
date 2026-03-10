import React from 'react';
import * as Speech from 'expo-speech';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LargeButton } from '../components/LargeButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/theme';

function getMedicineTitle(medicine) {
  if (!medicine) return 'Medicine Details';
  return (
    medicine.name ||
    medicine.medicineName ||
    medicine.brandName ||
    medicine.genericName ||
    medicine.title ||
    'Medicine Details'
  );
}

function getField(medicine, keys) {
  for (const k of keys) {
    const v = medicine?.[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function DetailSection({ title, text }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text || 'Not available'}</Text>
    </View>
  );
}

export default function MedicineDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const medicineString = params.medicine;
  let medicine = null;
  try {
    medicine = typeof medicineString === 'string' ? JSON.parse(medicineString) : null;
  } catch (_e) {
    console.error('Failed to parse medicine params');
  }
  const name = getMedicineTitle(medicine);
  const usage = getField(medicine, ['usage', 'indication', 'indications', 'uses', 'description']);
  const dosage = getField(medicine, ['dosage', 'dose', 'dosing', 'recommendedDosage']);
  const sideEffects = getField(medicine, ['sideEffects', 'side_effects', 'adverseEffects', 'adverse_effects']);
  const precautions = getField(medicine, ['precautions', 'warnings', 'warning', 'contraindications']);

  function onVoiceRead() {
    const text = [
      `Medicine name: ${name}.`,
      `Usage: ${usage || 'Not available'}.`,
      `Dosage: ${dosage || 'Not available'}.`,
      `Side effects: ${sideEffects || 'Not available'}.`,
      `Precautions: ${precautions || 'Not available'}.`,
    ].join(' ');

    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 1.0 });
  }

  function onListenExplanation() {
    const text = [
      `Usage: ${usage || 'Not available'}.`,
      `Dosage: ${dosage || 'Not available'}.`,
      `Warnings: ${precautions || 'Not available'}.`,
    ].join(' ');

    Speech.stop();
    // Slower rate for clearer speech for elderly users
    Speech.speak(text, { rate: 0.7, pitch: 1.0 });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{name}</Text>

        <DetailSection title="Usage" text={usage} />
        <DetailSection title="Dosage" text={dosage} />
        <DetailSection title="Side Effects" text={sideEffects} />
        <DetailSection title="Precautions" text={precautions} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missed Dose & Guidance</Text>
          <Text style={styles.sectionText}>
            If you miss a dose, take it as soon as you remember. However, if it is almost time for your next dose, skip the missed dose and go back to your regular schedule. Do not double the dose.
          </Text>
        </View>

        <View style={styles.cta}>
          <LargeButton
            title="Listen Explanation"
            variant="secondary"
            onPress={onListenExplanation}
            accessibilityLabel="Listen to medicine explanation"
          />
          <LargeButton
            title="Voice Read"
            variant="secondary"
            onPress={onVoiceRead}
            accessibilityLabel="Read medicine information aloud"
          />
          <LargeButton
            title="Set Reminder"
            onPress={() => router.push({ pathname: '/screens/MedicineRemindersScreen', params: { medicine: JSON.stringify(medicine) } })}
            accessibilityLabel="Set reminder button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 14 },
  section: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 20,
    color: Colors.text,
    lineHeight: 30,
  },
  cta: {
    marginTop: 12,
    paddingBottom: 24,
  },
});
