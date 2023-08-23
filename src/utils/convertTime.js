import { formatCommaViews } from "./formatViews";
export const convertTimer = (totalSecond) => {
  let hours = Math.floor(totalSecond / 3600);
  let minutes = Math.floor((totalSecond - hours * 3600) / 60);
  let seconds = totalSecond - hours * 3600 - minutes * 60;
  const formatTime = [hours, minutes, seconds].map((t) =>
    t < 10 ? "0" + t : t
  );

  return parseInt(formatTime[0]) !== 0
    ? `${formatCommaViews(formatTime[0])}:${formatTime[1]}:${formatTime[2]}`
    : `${formatTime[1]}:${formatTime[2]}`;
};
