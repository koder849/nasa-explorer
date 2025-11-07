import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useMars = (sol, camera) => {
  return useQuery({
    queryKey: ["mars", sol, camera],
    queryFn: async () => {
      const params = { sol };
      if (camera) params.camera = camera;
      try {
        const response = await api.get("/mars/photos", { params });
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response.data?.photos)) {
          return response.data.photos;
        } else if (response.data?.error || response.data?.message) {
          throw new Error(response.data.error || response.data.message);
        }
        return [];
      } catch (err) {
        // The Mars Rover API is archived, throw with a clear message
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
