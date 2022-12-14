import { TotalWorkTime } from "../types";

//7.5H
export const TOTAL_MS_WORK_DAY = 27000000;

export const dateToTime = (date: Date) => {
  const timeString =
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2);

  return timeString;
};

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const convertMsToTime = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`;
};

export const subtractHours = (numOfHours: number, date = new Date()) => {
  date.setHours(date.getHours() - numOfHours);

  return date;
};

export const addHoursAndMinutse = (
  hours: number,
  minutes: number,
  date = new Date()
) => {
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);

  return date;
};

export const shouldAutoStop = (date: Date) => {
  const defaultLengthInMs = 12 * 60 * 60 * 1000; // 12 hours
  const diff = new Date().getTime() - date.getTime();
  return diff >= defaultLengthInMs;
};

export const timeDiffToString = (startDate: Date, endDate: Date) => {
  const diff = endDate.getTime() - startDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const secondsRest = seconds % 60;
  const minutesRest = minutes % 60;
  const hoursRest = hours % 24;

  return `${padTo2Digits(hoursRest)}:${padTo2Digits(
    minutesRest
  )}:${padTo2Digits(secondsRest)}`;
};

export const totalWorkTime = (sessions: any): TotalWorkTime => {
  let totalMsWorked = 0;
  let totalDaysWorked = 0;
  sessions.forEach((s: any) => {
    totalMsWorked += s.endTime.toDate() - s.startTime.toDate();
    totalDaysWorked++;
  });

  let totalMsShouldWork = totalDaysWorked * TOTAL_MS_WORK_DAY;

  return {
    numDaysWorked: totalDaysWorked,
    totalMsWorked,
    totalMsShouldWork,
  };
};
