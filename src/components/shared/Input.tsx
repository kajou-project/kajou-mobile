import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import theme from "../../styles/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

export default function Input(props: InputProps): React.JSX.Element {
  const { style, ...rest } = props;

  return (
    <View style={rest.containerStyle}>
      <Text style={styles.label}>{props.label}</Text>

      <TextInput
        style={[styles.input, props.error ? styles.borderError : styles.borderBase, style]}
        {...rest}
      />

      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  borderBase: {
    borderColor: theme.colors.secondary[600]
  },
  borderError: {
    borderColor: theme.colors.primary[600]
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.primary[500]
  }
});
