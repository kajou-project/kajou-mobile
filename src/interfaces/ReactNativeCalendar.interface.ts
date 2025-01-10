export interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

export interface DayComponentProps {
  date: DateObject;
  state?:
    | "disabled"
    | "today"
    | "selected"
    | "selectedStart"
    | "selectedEnd"
    | "selectedMiddle";
}
