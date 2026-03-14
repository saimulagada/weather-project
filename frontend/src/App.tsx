import { useEffect, useState } from "react";
import Chart from "./components/Chart";
import { fetchActualData, fetchForecastData } from "./services/api";

type ChartPoint = {
  time: string;
  actual: number | null;
  forecast: number | null;
};

type ActualItem = {
  startTime: string;
  generation: number;
};

type ForecastItem = {
  startTime: string;
  publishTime: string;
  generation: number;
};

function App() {
  const [actualData, setActualData] = useState<ActualItem[]>([]);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const [horizon, setHorizon] = useState(4);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    processData();
  }, [actualData, forecastData, horizon, startTime, endTime]);

  const loadData = async () => {
    try {
      setLoading(true);

      const actual = await fetchActualData();
      const forecast = await fetchForecastData();
      console.log(actual);
console.log(forecast);

      setActualData(actual);
      setForecastData(forecast);

      setLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    }
  };
const processData = () => {
  if (!actualData.length || !forecastData.length) return;

  let filteredActual = [...actualData];

  if (startTime) {
    filteredActual = filteredActual.filter(
      (a) => new Date(a.startTime) >= new Date(startTime)
    );
  }

  if (endTime) {
    filteredActual = filteredActual.filter(
      (a) => new Date(a.startTime) <= new Date(endTime)
    );
  }

  const combined: ChartPoint[] = filteredActual.slice(0, 100).map((a) => {
    const targetTime = new Date(a.startTime);

    const validForecast = forecastData
      .filter((f) => new Date(f.startTime) <= targetTime)
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0];

    return {
      time: a.startTime.slice(11, 16),
      actual: a.generation,
      forecast: validForecast ? validForecast.generation : null,
    };
  });

  setChartData(combined);
};

  const resetFilters = () => {
    setStartTime("");
    setEndTime("");
    setHorizon(4);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Wind Forecast Monitoring
      </h1>

      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="mb-4">
            <label className="font-semibold block mb-2">
              Forecast Horizon: {horizon} hours
            </label>

            <input
              type="range"
              min="0"
              max="48"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-1">
                Start Time
              </label>

              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1">
                End Time
              </label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white shadow rounded-lg p-4 flex-1">
          {loading ? (
            <div className="text-center p-10">Loading data...</div>
          ) : (
            <Chart data={chartData} />
          )}
        </div>

        {/* <div className="bg-white shadow rounded-lg p-4 mt-4 overflow-auto max-h-60">
          <h2 className="font-semibold mb-2">Debug Data</h2>

          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Time</th>
                <th className="border p-2">Actual</th>
                <th className="border p-2">Forecast</th>
              </tr>
            </thead>

            <tbody>
              {chartData.map((row, i) => (
                <tr key={i}>
                  <td className="border p-1">{row.time}</td>
                  <td className="border p-1">{row.actual}</td>
                  <td className="border p-1">{row.forecast ?? "null"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}

export default App;
