import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInputProps, View } from "react-native";
import theme from "../../styles/theme";
import { format } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface InputProps extends TextInputProps {
  label: string;
  type: "date" | "time" | "datetime" | "custom";
  format?: string;
  onChangeDate?: Function;
  containerStyle?: object;
}

export default function InputDate(props: InputProps): React.JSX.Element {
  const { style, ...rest } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const hideDatePicker = (): void => {
    setOpen(false);
  };

  const handleConfirm = (date: Date): void => {
    setDate(date);

    if (rest.onChangeDate) {
      rest.onChangeDate(format(date, returnFormat()));
    }

    hideDatePicker();
  };

  const getFormat = (): string => {
    switch (rest.type) {
      case "date":
        return "dd/MM/yyyy";
      case "time":
        return "HH:mm";
      case "datetime":
        return "dd/MM/yyyy HH:mm";
      case "custom":
        return rest.format || "dd/MM/yyyy";
    }
  };

  const returnFormat = (): string => {
    switch (rest.type) {
      case "date":
        return "yyyy-MM-dd";
      case "time":
        return "HH:mm:ss";
      case "datetime":
        return "yyyy-MM-dd HH:mm:ss";
      case "custom":
        return rest.format || "yyyy-MM-dd";
    }
  };

  return (
    <View style={rest.containerStyle}>
      <Text style={styles.label}>{rest.label}</Text>

      <Pressable style={[styles.input, style]} onPress={() => setOpen(!open)}>
        <Text style={date ? styles.text : styles.placeholder}>
          {date ? format(date, getFormat()) : rest.placeholder}
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={open}
        mode={rest.type === "custom" ? "date" : rest.type}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.secondary[600],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  text: {
    color: "black"
  },
  placeholder: {
    color: "#b4b4b4"
  },
  calendar: {
    position: "absolute",
    bottom: 70,
    left: 0,
    width: "100%",
    // height: 400,
    zIndex: 10,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: 8
  },
  day: {
    borderRadius: 999,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  dayText: {
    color: "black",
    textAlign: "center",
    fontSize: 16
  },
  todayText: {
    color: theme.colors.primary[600],
    fontWeight: "bold"
  },
  disabledText: {
    color: "#d4d4d4"
  }
});
