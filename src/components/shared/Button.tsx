import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import theme from "../../styles/theme";

interface ButtonProps extends TouchableOpacityProps {
  type: "primary" | "secondary";
  label: string;
  disabled?: boolean;
}

export default function Button(props: ButtonProps): React.JSX.Element {
  const { style, ...rest } = props;

  return (
    <TouchableOpacity
      style={[styles.button, rest.disabled ? styles.disabled : styles.primary, style]}
      onPress={rest.disabled ? () => {} : rest.onPress}
    >
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  primary: {
    backgroundColor: theme.colors.main[600],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[600],
  },
  disabled: {
    backgroundColor: theme.colors.main[600],
    opacity: 0.5,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
