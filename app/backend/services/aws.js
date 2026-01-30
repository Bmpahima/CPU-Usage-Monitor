import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import {
  CloudWatchClient,
  GetMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

const getInstanceId = async (ipAddress) => {
  try {
    const client = new EC2Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    if (!client) {
      return {
        success: false,
        message: "Credentials are invalid.",
        instanceId: null,
      };
    }

    const command = new DescribeInstancesCommand({
      Filters: [
        {
          Name: "private-ip-address",
          Values: [ipAddress],
        },
      ],
    });

    let response = await client.send(command);
    let instanceId = response.Reservations?.[0]?.Instances?.[0]?.InstanceId;

    if (!instanceId) {
      const commandSecondTry = new DescribeInstancesCommand({
        Filters: [
          {
            Name: "ip-address",
            Values: [ipAddress],
          },
        ],
      });

      response = await client.send(commandSecondTry);
      instanceId = response?.Reservations?.[0]?.Instances?.[0]?.InstanceId;
    }

    if (!instanceId)
      return {
        success: false,
        message: "No instance was found that matches this IP address.",
        instanceId: null,
      };

    return {
      success: true,
      message: "Instance found.",
      instanceId,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unexpected error occurred. No instance was found.",
      instanceId: null,
    };
  }
};

export const getCPUUtilization = async ({
  instanceId,
  startTime,
  endTime,
  timeIntervalInSeconds,
}) => {
  try {
    const client = new CloudWatchClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    if (!client) {
      return {
        success: false,
        timestamps: null,
        values: null,
        message: "Credentials are invalid.",
      };
    }

    const command = new GetMetricDataCommand({
      MetricDataQueries: [
        {
          Id: "cpuUtilizationMetrics",
          MetricStat: {
            Metric: {
              Namespace: "AWS/EC2",
              MetricName: "CPUUtilization",
              Dimensions: [{ Name: "InstanceId", Value: instanceId }],
            },
            Period: timeIntervalInSeconds,
            Stat: "Average",
          },
          ReturnData: true,
        },
      ],
      StartTime: startTime,
      EndTime: endTime,
      ScanBy: "TimestampAscending",
    });

    const response = await client.send(command);

    console.log("RESPONSE: \n", response);
    const { Timestamps, Values, StatusCode } = response.MetricDataResults[0];

    return {
      success: StatusCode == "Complete",
      timestamps: Timestamps,
      values: Values,
      message: StatusCode == "Complete" ? "Complete" : "Failed",
    };
  } catch (error) {
    return {
      success: false,
      timestamps: null,
      values: null,
      message: "Unexpected error occurred. No metrics provided.",
    };
  }
};

export default getInstanceId;
