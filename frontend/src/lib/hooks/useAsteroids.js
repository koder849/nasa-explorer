import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useAsteroids = (startDate, endDate) => {
  return useQuery({
    queryKey: ["asteroids", startDate, endDate],
    queryFn: async () => {
      const response = await api.get("/asteroids/feed", {
        params: { start_date: startDate, end_date: endDate },
      });
      if (response.data?.near_earth_objects) {
        const flattened = Object.values(response.data.near_earth_objects).flat();
        return flattened.slice(0, 12);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return [];
    },
  });
};
