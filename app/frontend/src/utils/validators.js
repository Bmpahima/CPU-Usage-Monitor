export function isValidIP(s) {
  const n = s.length;
  if (n < 7) return false;

  const v = s.split(".");
  if (v.length !== 4) return false;

  for (let i = 0; i < v.length; i++) {
    const temp = v[i];
    if (temp.length > 1 && temp[0] === "0") return false;

    for (let j = 0; j < temp.length; j++) {
      if (isNaN(temp[j])) return false;
    }

    if (parseInt(temp) > 255) return false;
  }
  return true;
}

export function isValidDate(d) {
  return !isNaN(Date.parse(d));
}

export function isValidTimeRange(startDate, endDate) {
  try {
    if (!isValidDate(startDate) || !isValidDate(endDate)) return false;

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    return sDate < eDate;
  } catch (error) {
    return false;
  }
}

export function isValidTimeInterval(interval) {
  return Number(interval) > 0;
}

export default function isValidForm({
  ipAddress,
  startDate,
  endDate,
  timeInterval,
}) {
  const result = {
    ipAddress: { valid: true, message: "" },
    startDate: { valid: true, message: "" },
    endDate: { valid: true, message: "" },
    timeRange: { valid: true, message: "" },
    timeInterval: { valid: true, message: "" },
  };

  if (!ipAddress || !isValidIP(ipAddress)) {
    result["ipAddress"] = { valid: false, message: "IP address is not valid." };
  }

  if (!startDate) {
    result.startDate = { valid: false, message: "Start time is required." };
  }

  if (!endDate) {
    result.endDate = { valid: false, message: "End time is required." };
  }

  if (startDate && endDate && !isValidTimeRange(startDate, endDate)) {
    result.timeRange = {
      valid: false,
      message: "Time range is invalid. Choose Start Time < End Time.",
    };
  }

  if (!isValidTimeInterval(timeInterval)) {
    result["timeInterval"] = {
      valid: false,
      message: "Time interval should be greater than 0.",
    };
  }

  return result;
}
