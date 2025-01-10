import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import theme from "../../styles/theme";

interface InputProps extends TextInputProps {
  label: string;
}

export default function Input(props: InputProps): React.JSX.Element {
  const { style, ...rest } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <TextInput style={[styles.input, style]} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: theme.colors.secondary[600],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
