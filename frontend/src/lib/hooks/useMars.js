import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useMars = (sol, camera) => {
  return useQuery({
    queryKey: ["mars", sol, camera],
    queryFn: async () => {
      const params = { sol };
      if (camera) params.camera = camera;
      const response = await api.get("/mars/photos", { params });
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data?.photos)) {
        return response.data.photos;
      } else if (response.data?.error || response.data?.message) {
        throw new Error(response.data.error || response.data.message);
      }
      return [];
    },
  });
};
