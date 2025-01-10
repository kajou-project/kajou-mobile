import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInputProps, View } from "react-native";
import theme from "../../styles/theme";
import { Calendar, CalendarList } from "react-native-calendars";
import { DateObject, DayComponentProps } from "../../interfaces/ReactNativeCalendar.interface";
import ChevronLeft from "../../assets/icons/chevron-left.svg";
import ChevronRight from "../../assets/icons/chevron-right.svg";
import { format } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface InputProps extends TextInputProps {
  label: string;
  type: "date" | "time" | "datetime";
  onChangeDate?: Function;
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
      rest.onChangeDate(date);
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{rest.label}</Text>

      <Pressable style={[styles.input, style]} onPress={() => setOpen(!open)}>
        <Text style={date ? styles.text : styles.placeholder}>
          {date ? format(date, getFormat()) : rest.placeholder}
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={open}
        mode={rest.type}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* {open && (
        // <View style={styles.calendar}>
        //   <CalendarList
        //     showScrollIndicator={true}
        //     calendarStyle={{ width: '100%' }}
        //   />
        // </View>
        <Calendar
          renderArrow={(direction: "left" | "right") => {
            {
              return direction === "left" ? <ChevronLeft /> : <ChevronRight />;
            }
          }}
          dayComponent={({ date, state }: DayComponentProps) => {
            return (
              <Pressable style={styles.day} onPress={() => chooseDate(date)}>
                <Text
                  style={[
                    styles.dayText,
                    state === "disabled" ? styles.disabledText : undefined,
                    state === "today" ? styles.todayText : undefined,
                  ]}
                >
                  {date.day}
                </Text>
              </Pressable>
            );
          }}
          style={styles.calendar}
        />
      )} */}
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
    color: theme.colors.main[600],
    fontWeight: "bold"
  },
  disabledText: {
    color: "#d4d4d4"
  }
});
