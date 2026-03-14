import axios from "axios";

export const fetchActualData = async () => {
  const res = await axios.get(
    "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?fuelType=WIND"
  );

  return res.data;
};

export const fetchForecastData = async () => {
  const res = await axios.get(
    "https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream"
  );

  return res.data;
};