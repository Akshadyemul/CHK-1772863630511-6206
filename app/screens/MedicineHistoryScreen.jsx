import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function MedicineHistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Medicine History</Text>
        <Text style={styles.body}>
          This screen will show your past medicines and doses taken.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B2D4D', marginBottom: 10 },
  body: { fontSize: 20, color: '#2B4A66', lineHeight: 28 },
});
