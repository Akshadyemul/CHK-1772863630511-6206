import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fetchHistory } from '../services/historyService';
import { useRouter } from 'expo-router';

function formatDate(dateString: any) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return d.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return d.toString();
  }
}

function getMedicineTitle(item: any) {
  return item?.medicineName || 'Unknown medicine';
}

export default function HistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchHistory({ limit: 80 });
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Could not load history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.body}>Your recent searches and barcode scans.</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.statusText}>Loading history…</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item?._id ?? item?.id ?? index)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/screens/MedicineDetailsScreen', params: { medicine: JSON.stringify(item?.medicineData || { name: item?.medicineName }) } })}
              accessibilityRole="button"
              accessibilityLabel={`Open details for ${getMedicineTitle(item)}`}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <Text style={styles.itemTitle}>{getMedicineTitle(item)}</Text>
              <Text style={styles.itemSubtitle}>Date: {formatDate(item?.createdAt)}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            loading ? null : (
              <Text style={styles.empty}>
                No history yet. Search or scan a medicine to see it here.
              </Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B2D4D', marginBottom: 10 },
  body: { fontSize: 20, color: '#2B4A66', lineHeight: 28, marginBottom: 10 },
  listContent: { paddingTop: 6, paddingBottom: 24 },
  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D6E1EC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  itemPressed: { opacity: 0.85 },
  itemTitle: { fontSize: 22, fontWeight: '800', color: '#0B2D4D', marginBottom: 6 },
  itemSubtitle: { fontSize: 18, color: '#2B4A66', lineHeight: 24 },
  empty: { marginTop: 14, fontSize: 18, color: '#2B4A66', lineHeight: 26 },
  error: { marginTop: 8, fontSize: 18, color: '#B00020', lineHeight: 24 },
  center: { paddingVertical: 12 },
  statusText: { marginTop: 10, fontSize: 18, color: '#2B4A66' },
});
