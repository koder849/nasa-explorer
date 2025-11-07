import { useQuery } from "@tanstack/react-query";
import api from "../api";

const formatEpicUrl = (item) => {
  const date = item.date.split(" ")[0];
  const [year, month, day] = date.split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${item.image}.jpg`;
};

export const useEarth = (date) => {
  return useQuery({
    queryKey: ["earth", date],
    queryFn: async () => {
      const params = date ? { date } : undefined;
      try {
        const response = await api.get("/earth/epic", { params });
        if (Array.isArray(response.data)) {
          return response.data.slice(0, 6).map((item) => ({
            ...item,
            url: formatEpicUrl(item),
          }));
        } else if (response.data?.error) {
          throw new Error(response.data.error);
        }
        return [];
      } catch (err) {
        // The EPIC API is archived, throw with a clear message
        const errorMsg = err.message || "";
        if (errorMsg.includes("archived") || errorMsg.includes("404") || errorMsg.includes("not available")) {
          throw new Error("ARCHIVED");
        }
        throw err;
      }
    },
    retry: false, // Don't retry archived endpoints
  });
};
