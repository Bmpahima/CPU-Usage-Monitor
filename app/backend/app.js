import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import getInstanceId, { getCPUUtilization } from "./services/aws.js";
import { validate } from "./middleware/validate.js";
import * as validators from "./validators/validators.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get(
  "/cpu-utilization-metrics",
  validate(validators.cpuUsageValidator),
  async (req, res, next) => {
    try {
      const { ipAddress, startDateTime, endDateTime, timeIntervalInSeconds } =
        req.validated || {};

      console.log("Validated: ", req.validated);

      if (
        !ipAddress ||
        !startDateTime ||
        !endDateTime ||
        !timeIntervalInSeconds
      ) {
        const err = new Error("Credentials are invalid.");
        err.status = 422;
        return next(err);
      }

      const result = await getInstanceId(ipAddress);
      if (!result.success) {
        const err = new Error(
          result.message ||
            "No instance was found that matches this IP address.",
        );
        err.status = 404;
        return next(err);
      }

      const instanceId = result.instanceId;

      const input = {
        instanceId,
        startTime: startDateTime,
        endTime: endDateTime,
        timeIntervalInSeconds: timeIntervalInSeconds,
      };

      const metrics = await getCPUUtilization(input);

      if (!metrics || !metrics.success) {
        const err = new Error(
          metrics.message ||
            "No CPU Utilization metrics are available for this instance.",
        );
        err.status = 404;
        return next(err);
      }

      if (metrics.values?.length === 0) {
        return res.status(404).json({
          ok: false,
          message:
            "No CPU Utilization metrics are available for this instance.",
        });
      }

      const maxValue = Math.round(Math.max(...metrics.values) * 100);
      const minValue = Math.round(Math.min(...metrics.values) * 100);

      let avgValue = 0;
      for (const x of metrics.values) avgValue += x;
      avgValue = Math.round((avgValue / metrics.values.length) * 100);

      return res.status(200).json({
        ok: true,
        metrics: {
          timestamps: metrics.timestamps,
          values: metrics.values,
          max: maxValue,
          min: minValue,
          avg: avgValue,
        },
        message: metrics.message,
      });
    } catch (error) {
      return next(error);
    }
  },
);

app.use((err, req, res, next) => {
  console.log(err.stack);

  const status = err.status || 500;
  const message = err.message || "Unexpected error occurred";

  res.status(status).json({
    ok: false,
    message: message,
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
