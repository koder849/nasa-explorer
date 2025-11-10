import { useQuery } from "@tanstack/react-query";
import { fetchNeo } from "../nasaApi";

export const useAsteroids = (startDate, endDate) => {
  return useQuery({
    queryKey: ["asteroids", startDate, endDate],
    queryFn: async () => {
      const data = await fetchNeo(startDate, endDate);
      if (data?.near_earth_objects) {
        const flattened = Object.values(data.near_earth_objects).flat();
        return flattened.slice(0, 12);
      } else if (data?.error) {
        throw new Error(data.error);
      }
      return [];
    },
  });
};
