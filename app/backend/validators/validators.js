import { query } from "express-validator";

export const cpuUsageValidator = [
  query("ipAddress")
    .exists()
    .withMessage("IP address is required.")
    .bail()
    .isString()
    .trim()
    .isIP(4)
    .withMessage("IP address is not in the right format."),
  query("startDateTime")
    .exists()
    .withMessage("Start Date is required.")
    .bail()
    .isString()
    .trim()
    .toDate()
    .withMessage("Invalid date format."),
  query("endDateTime")
    .exists()
    .withMessage("End Date is required.")
    .bail()
    .isString()
    .trim()
    .toDate()
    .withMessage("Invalid date format."),
  query("timeIntervalInSeconds")
    .exists()
    .withMessage("Time interval is required.")
    .bail()
    .isString()
    .trim()
    .isNumeric()
    .withMessage("Time interval must be a positive integer.")
    .toInt()
    .custom((val) => {
      if (Number(val) % 60 != 0)
        throw new Error("Unexpected error, time interval must be an integer.");
      return true;
    }),
];
