import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type ChartPoint = {
  time: string;
  actual: number | null;
  forecast: number | null;
};

type Props = {
  data: ChartPoint[];
};

const Chart = ({ data }: Props) => {
  return (
    <div className="w-full h-[400px] bg-white shadow rounded p-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#2563eb"
            name="Actual"
          />

          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#16a34a"
            name="Forecast"
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;