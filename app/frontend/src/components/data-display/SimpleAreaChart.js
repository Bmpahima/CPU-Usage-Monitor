import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
// #endregion
const SimpleAreaChart = ({ data }) => {
  const { values, timestamps } = data;
  const formattedData = values.map((val, idx) => ({
    name: formatDate(timestamps.at(idx)),
    precentage: (val * 100).toFixed(2),
  }));

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        style={{
          padding: "10px",
        }}
        data={formattedData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{ value: "DateTime", angle: 0 }}
          tick={false}
        />
        <YAxis width="auto" angle={0} unit="%" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="precentage"
          stroke="#0234b3"
          fill="#5980ff"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart;
