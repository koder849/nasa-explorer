import { useQuery } from "@tanstack/react-query";
import { fetchMarsPhotos } from "../nasaApi";

export const useMars = (sol, camera) => {
  return useQuery({
    queryKey: ["mars", sol, camera],
    queryFn: async () => {
      try {
        const data = await fetchMarsPhotos(sol, camera);
        if (Array.isArray(data)) {
          return data;
        } else if (Array.isArray(data?.photos)) {
          return data.photos;
        } else if (data?.error || data?.message) {
          throw new Error(data.error || data.message);
        }
        return [];
      } catch (err) {
        // The Mars Rover API is archived, throw with a clear message
        const errorMsg = err.message || "";
        if (
          errorMsg.includes("archived") ||
          errorMsg.includes("404") ||
          errorMsg.includes("not available")
        ) {
          throw new Error("ARCHIVED");
        }
        throw err;
      }
    },
    retry: false, // Don't retry archived endpoints
  });
};
