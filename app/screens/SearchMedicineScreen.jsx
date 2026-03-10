import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/theme';
import { searchMedicine } from '../services/api';
import { addHistoryItem } from '../services/historyService';
import { useRouter } from 'expo-router';

export default function SearchMedicineScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicine, setMedicine] = useState(null);
  const [notFound, setNotFound] = useState(false);

  async function onSearch() {
    const q = query.trim();
    if (!q || loading) return;

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setNotFound(false);
    setMedicine(null);

    try {
      const data = await searchMedicine(q);
      setMedicine(data);
      setNotFound(false);
      await addHistoryItem({
        medicineName: data?.name || q,
        medicineData: data,
        source: 'search',
      });
    } catch (e) {
      setMedicine(null);
      if (e.message.includes('404') || e.response?.status === 404) {
        setNotFound(true);
        setError('');
      } else {
        setNotFound(false);
        setError(e?.message || 'Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Medicine</Text>

        <Text style={styles.label}>Medicine name</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Type a medicine name"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onSearch}
          editable={!loading}
          autoCapitalize="words"
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Medicine name input"
        />

        <View style={styles.searchRow}>
          <View style={styles.searchButtonWrap}>
            <LargeButton
              title={loading ? 'Searching…' : 'Search'}
              onPress={onSearch}
              accessibilityLabel="Search medicine button"
            />
          </View>
          {loading ? <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} /> : null}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.resultsTitle}>Result</Text>

        {!loading && notFound && (
          <Text style={styles.empty}>Medicine information not found.</Text>
        )}

        {!loading && medicine && (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{medicine.name || 'Medicine'}</Text>
            <Text style={styles.itemSubtitle}>Tap below to view full details</Text>
            <LargeButton
              title="Open Details"
              onPress={() => router.push({ pathname: '/screens/MedicineDetailsScreen', params: { medicine: JSON.stringify(medicine) } })}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  label: { fontSize: 18, color: Colors.textMuted, marginTop: 6, marginBottom: 8 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    color: Colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  searchButtonWrap: { flex: 1 },
  spinner: { marginLeft: 12 },
  error: { marginTop: 10, fontSize: 16, color: Colors.error, lineHeight: 24 },
  resultsTitle: { marginTop: 14, fontSize: 22, fontWeight: '800', color: Colors.text },
  itemTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  itemSubtitle: { fontSize: 16, color: Colors.textMuted, marginBottom: 16 },
  empty: { marginTop: 14, fontSize: 18, color: Colors.textMuted, lineHeight: 26 },
  card: {
    marginTop: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});
