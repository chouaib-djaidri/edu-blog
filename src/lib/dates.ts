import { CalendarDate } from "@internationalized/date";
import { DateValue } from "react-aria-components";
import {
  isToday,
  isTomorrow,
  isPast,
  differenceInCalendarDays,
  format,
  parse,
} from "date-fns";

export function dateToDateValue(
  date: Date | null | undefined
): DateValue | null {
  if (!date) return null;
  return new CalendarDate(
    parseInt(format(date, "yyyy")),
    parseInt(format(date, "M")),
    parseInt(format(date, "d"))
  );
}

export function dateValueToDate(dateValue: DateValue | null): Date | null {
  if (!dateValue) return null;
  if ("year" in dateValue && "month" in dateValue && "day" in dateValue) {
    const dateString = `${dateValue.year}-${dateValue.month.toString().padStart(2, "0")}-${dateValue.day.toString().padStart(2, "0")}`;
    return parse(dateString, "yyyy-MM-dd", new Date());
  }
  return null;
}

export function getSimpleDueDate(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  const dueDate = new Date(date);
  const today = new Date();
  if (isToday(dueDate)) {
    return "Today";
  }
  if (isTomorrow(dueDate)) {
    return "Tomorrow";
  }
  const dayDifference = differenceInCalendarDays(dueDate, today);
  if (isPast(dueDate)) {
    if (dayDifference >= -30) {
      return `${Math.abs(dayDifference)} days ago`;
    } else {
      return format(dueDate, "MMM d, yyyy");
    }
  }
  if (dayDifference <= 30) {
    return `in ${dayDifference} days`;
  } else {
    return format(dueDate, "MMM d, yyyy");
  }
}
