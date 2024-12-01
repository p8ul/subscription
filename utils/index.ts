import moment from "moment";
import momentZone from "moment-timezone";

export function formatDateTime(dateString: string): string {
  const date = moment(dateString);

  if (date.isSame(moment(), "day")) {
    // If the date is today
    return `Today ${date.format("HH:mm")}`;
  } else if (date.isSame(moment().subtract(1, "day"), "day")) {
    // If the date is yesterday
    return `Yesterday ${date.format("HH:mm")}`;
  } else {
    // Otherwise, show day of the week and time
    return `${date.format("dddd")} ${date.format("HH:mm")}`;
  }
}

export function getNextMonthEndDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Create a new date object for the last day of the next month
  const endOfNextMonth = new Date(year, month + 2, 0);
  return endOfNextMonth;
}

export function formatNumberWithCommas(number: string | number) {
  return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getFullMonthName(date = new Date()) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return monthNames[date.getMonth()];
}