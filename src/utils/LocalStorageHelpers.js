// src/utils/localStorageHelpers.js
import dayjs from "dayjs";                   // ✅ Core Day.js library
import isoWeek from "dayjs/plugin/isoWeek";  // ✅ Week grouping plugin

dayjs.extend(isoWeek);                       // ✅ Activate plugin


export const groupByTimePeriod = (entries, period) => {
  const result = {};
  entries.forEach(e => {
    const key = period === "daily"
      ? e.date
      : period === "weekly"
      ? dayjs(e.date).isoWeek()
      : dayjs(e.date).format("YYYY-MM");
    result[key] = (result[key] || 0) + e.amount;
  });
  return result;
};

export const calculateTotals = (entries) => {
  const allTime = entries.reduce((sum, e) => sum + e.amount, 0);
  const now = dayjs();
  const monthly = entries.filter(e => dayjs(e.date).format("YYYY-MM") === now.format("YYYY-MM"))
    .reduce((sum, e) => sum + e.amount, 0);
  const weekly = entries.filter(e => dayjs(e.date).isoWeek() === now.isoWeek())
    .reduce((sum, e) => sum + e.amount, 0);
  const daily = entries.filter(e => e.date === now.format("YYYY-MM-DD"))
    .reduce((sum, e) => sum + e.amount, 0);

  return { allTime, monthly, weekly, daily };
};