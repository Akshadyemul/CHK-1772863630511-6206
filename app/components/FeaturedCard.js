import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export function FeaturedCard({ title, subtitle, iconName, onPress, dateInfo, timeInfo }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={32} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.surface} style={styles.chevron} />
      </View>
      
      {(dateInfo || timeInfo) && (
        <>
            <View style={styles.divider} />
            <View style={styles.bottomRow}>
            {dateInfo && (
                <View style={styles.infoPill}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.surface} />
                    <Text style={styles.infoText}>{dateInfo}</Text>
                </View>
            )}
            {timeInfo && (
                <View style={styles.infoPill}>
                    <Ionicons name="time-outline" size={16} color={Colors.surface} />
                    <Text style={styles.infoText}>{timeInfo}</Text>
                </View>
            )}
            </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.surface,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCFBF1',
  },
  chevron: {
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    color: Colors.surface,
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
});
