import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/theme';

export function LargeButton({
  title,
  onPress,
  variant = 'primary',
  accessibilityLabel,
  disabled = false,
  style,
}) {
  const isSecondary = variant === 'secondary';
  
  const bgColor = disabled 
    ? '#D6E1EC' 
    : isSecondary 
      ? Colors.surface 
      : Colors.primary;
      
  const textColor = disabled 
    ? '#6B7C8C' 
    : isSecondary 
      ? Colors.primary 
      : Colors.surface;
      
  const borderColor = disabled 
    ? '#D6E1EC' 
    : Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor, borderColor },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 60,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
