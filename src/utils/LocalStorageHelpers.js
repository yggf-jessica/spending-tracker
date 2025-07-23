import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export const groupByTimePeriod = (entries, period) => {
  const result = {};
  entries.forEach(e => {
    const key = period === "daily"
      ? e.date
      : period === "weekly"
      ? `Week ${dayjs(e.date).isoWeek()}`
      : dayjs(e.date).format("YYYY-MM");
    result[key] = (result[key] || 0) + e.amount;
  });
  return result;
};

export const calculateTotals = (entries) => {
  const allTime = entries.reduce((sum, e) => sum + e.amount, 0);
  return { allTime };
};

export const filterByTimePeriod = (entries, period) => {
  const now = dayjs();
  if (period === "daily") {
    return entries.filter(e => e.date === now.format("YYYY-MM-DD"));
  } else if (period === "weekly") {
    return entries.filter(e => dayjs(e.date).isoWeek() === now.isoWeek());
  } else if (period === "monthly") {
    return entries.filter(e => dayjs(e.date).format("YYYY-MM") === now.format("YYYY-MM"));
  }
  return entries;
};
