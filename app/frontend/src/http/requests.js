import axios from "axios";

const SERVER_URL = "http://localhost:8000";

export const getCPUUtilizationMetric = async ({
  ipAddress,
  startDate,
  endDate,
  timeInterval,
}) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/cpu-utilization-metrics?ipAddress=${ipAddress}&startDateTime=${startDate}&endDateTime=${endDate}&timeIntervalInSeconds=${timeInterval * 60}`,
    );

    const resData = await response?.data;

    if (!resData || !resData.ok) {
      return {
        success: false,
        message: resData.message || "Failed to fetch CPU usage data.",
      };
    }

    return {
      success: true,
      message: resData.message,
      metrics: resData.metrics,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        return {
          success: false,
          message: "Unexpected error occurred. Failed to fetch CPU usage data.",
        };
      }

      const { data } = error.response;
      console.log(data);

      return {
        success: false,
        message:
          data?.message ||
          "Unexpected error occurred. Failed to fetch CPU usage data.",
      };
    }

    return {
      success: false,
      message: "Unexpected error occurred. Failed to fetch CPU usage data.",
    };
  }
};
