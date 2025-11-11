import axios from "axios";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov";

const nasaAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

nasaAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallback =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unexpected error";
    return Promise.reject(new Error(fallback));
  }
);

export const fetchApod = async (date = null) => {
  try {
    const params = { api_key: NASA_API_KEY };
    if (date) {
      params.date = date;
    }
    const response = await nasaAxios.get("/planetary/apod", { params });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchMarsPhotos = async (sol = 1000, camera = null) => {
  try {
    const params = { sol, api_key: NASA_API_KEY };
    if (camera) {
      params.camera = camera;
    }
    const response = await nasaAxios.get(
      "/mars-photos/api/v1/rovers/curiosity/photos",
      { params }
    );
    const photos = response.data.photos || [];
    if (!photos.length) {
      return {
        message:
          "No photos found for this sol/camera. Try other sol values or remove camera param.",
      };
    }
    return photos.slice(0, 12);
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchEpic = async (date = null) => {
  try {
    let url = "/EPIC/api/natural";
    if (date) {
      url = `/EPIC/api/natural/date/${date}`;
    }
    const params = { api_key: NASA_API_KEY };
    const response = await nasaAxios.get(url, { params });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchNeo = async (startDate = null, endDate = null) => {
  try {
    const params = { api_key: NASA_API_KEY };
    if (startDate) {
      params.start_date = startDate;
    }
    if (endDate) {
      params.end_date = endDate;
    }
    const response = await nasaAxios.get("/neo/rest/v1/feed", { params });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};
