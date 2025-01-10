import { Pressable, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";
import Check from "../../assets/icons/check.svg";

interface CheckboxProps {
  style?: object;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Checkbox(props: CheckboxProps): React.JSX.Element {
  const { style, label, value, onChange } = props;

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => onChange(!value)}
    >
      <View style={styles.checkbox}>
        {value && <Check style={styles.icon} />}
      </View>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.secondary[200],
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: theme.colors.secondary[600],
  },
  label: {
    marginLeft: 8,
  },
});
