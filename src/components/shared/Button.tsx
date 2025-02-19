import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import theme from "../../styles/theme";

interface ButtonProps extends TouchableOpacityProps {
  type: "primary" | "secondary" | "primaryOutline" | "secondaryOutline";
  label?: string;
  disabled?: boolean;
  icon?: React.JSX.Element;
}

export default function Button(props: ButtonProps): React.JSX.Element {
  const { style, ...rest } = props;

  return (
    <TouchableOpacity
      style={[styles.button, rest.disabled ? styles.disabled : styles[rest.type], style]}
      onPress={rest.disabled ? () => {} : rest.onPress}
    >
      {props.label && (
        <Text
          style={[
            styles.label,
            rest.type.includes("Outline") ? { color: "#000" } : { color: "#fff" }
          ]}
        >
          {props.label}
        </Text>
      )}
      {props.icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center"
  },
  primary: {
    backgroundColor: theme.colors.primary[600]
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500]
  },
  primaryOutline: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary[600]
  },
  secondaryOutline: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.secondary[500]
  },
  disabled: {
    backgroundColor: theme.colors.primary[600],
    opacity: 0.5
  },
  label: {
    fontSize: 16,
    fontWeight: "bold"
  }
});
