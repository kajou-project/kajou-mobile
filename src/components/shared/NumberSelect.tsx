import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Plus from "../../assets/icons/plus-black.svg";
import Minus from "../../assets/icons/minus.svg";
import theme from "../../styles/theme";

interface NumberSelectProps {
  value?: number;
  style?: object;
  min?: number;
  max?: number;
  type: "primary" | "secondary";
  onChangeNumber?: Function;
}

export default function NumberSelect(props: NumberSelectProps): React.JSX.Element {
  const [number, setNumber] = useState<number>(props.value ?? 1);

  const increase = () => {
    if (props.max && number >= props.max) {
      return;
    }

    setNumber(number + 1);
    props.onChangeNumber && props.onChangeNumber(number + 1);
  };

  const decrease = () => {
    if (props.min && number <= props.min) {
      return;
    }

    setNumber(number - 1);
    props.onChangeNumber && props.onChangeNumber(number - 1);
  };

  return (
    <View style={[styles.container, props.style]}>
      <Pressable onPress={decrease}>
        <Minus width={20} height={20} />
      </Pressable>

      <View style={[styles.pill, { backgroundColor: theme.colors[props.type][600] }]}>
        <Text style={{ color: theme.colors.white }}>{number}</Text>
      </View>

      <Pressable onPress={increase}>
        <Plus width={20} height={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 2
  }
});
