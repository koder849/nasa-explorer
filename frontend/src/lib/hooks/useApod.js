import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useApod = (date) => {
  return useQuery({
    queryKey: ["apod", date],
    queryFn: async () => {
      const params = date ? { date } : undefined;
      const response = await api.get("/apod", { params });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    enabled: true, // Always enable, but TanStack handles the date dependency
  });
};
