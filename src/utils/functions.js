export const timeAgo = (timestamp) => {
  const currentDate = new Date();
  const pastDate = new Date(timestamp);
  const timeDifference = currentDate - pastDate;

  const secondsAgo = Math.floor(timeDifference / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(daysAgo / 365);

  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  } else if (weeksAgo < 4) {
    return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
  } else if (monthsAgo < 12) {
    return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
  } else {
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
  }
};
