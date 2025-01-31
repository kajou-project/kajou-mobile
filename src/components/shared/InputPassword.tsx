import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import theme from "../../styles/theme";
import Eye from "../../assets/icons/eye.svg";
import EyeSlash from "../../assets/icons/eye-slash.svg";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

export default function InputPassword(props: InputProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const { style, ...rest } = props;

  return (
    <View style={[styles.container, props.containerStyle]}>
      <Text style={styles.label}>{props.label}</Text>

      <View>
        <TextInput
          textContentType="password"
          secureTextEntry={!showPassword}
          autoCorrect={false}
          style={[styles.input, props.error ? styles.borderError : styles.borderBase, style]}
          {...rest}
        />

        <Pressable style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <Eye /> : <EyeSlash />}
        </Pressable>
      </View>

      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
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
  icon: {
    position: "absolute",
    right: 16,
    top: 12
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
