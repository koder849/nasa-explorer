import { useQuery } from "@tanstack/react-query";
import { fetchApod } from "../nasaApi";

export const useApod = (date) => {
  return useQuery({
    queryKey: ["apod", date],
    queryFn: async () => {
      const data = await fetchApod(date);
      if (data?.error) {
        throw new Error(data.error);
      }
      return data;
    },
    enabled: true, // Always enable, but TanStack handles the date dependency
  });
};
